<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Laravolt\Avatar\Avatar;
use Illuminate\Support\Facades\DB;
use GuzzleHttp\Client;
use Laravel\Passport\Client as OClient;
use Illuminate\Support\Str;
use App\Events\EmailVerification;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;


class AuthController extends Controller
{


    public function userDetails()
    {
        return response()->json(Auth::user(), 201);
    }


    public function login(Request $request) {

        $remember_me = (isset($request->remember_me))?$request->remember_me:false;
        if(Auth::attempt(['email' => $request->email, 'password' => $request->password], $remember_me)) {

            return $this->getAccessAndRefreshTokens($request->email, $request->password);
        }

        //invalid credentials

        return response()->json(["error" => "Unauthorised access, check your credentials or sign up today"], 401);
    }


    public function signUp(Request $request) {
        $request->validate($rules = [
            'name' => 'required|max:150',
            'surname' => 'required|max:150',
            'email' => 'required|unique:users|max:150',
            'password' => 'required|min:6',
            'role' => 'required',
//            'secretariat' => 'required',
//            'department' => 'required',
//            'unit' => 'required',
        ]);

        $user = new User();
        $user->name = $request->name;
        $user->surname = $request->surname;
        $user->email = $request->email;
        $user->password = bcrypt($request->password);
        $profile_img = $this->genereteAvatar($user);
        $user->profile_img = $profile_img;
        $user->verification_token = Str::random(30);
        $user->role = $request->role;
        $user->secretariat = $request->secretariat;
        $user->department = $request->department;
        $user->unit = $request->unit;
        $user->created_by = $request->created_by;

        $user->save();
//        event(new EmailVerification($user));
        return response()->json(["message" => "başarılı kayıt"], 201);
    }


    public function getAccessAndRefreshTokens(string $email, string $password) {

        // echo url('/');
        try {

            // $oClient = DB::table('oauth_clients')->where('id', 2)->first();
            // $http = new Client();


            // $response = $http->post(url('/oauth/token'), [
            //     'form_params' => [
            //         'grant_type' => 'password',
            //         'client_id' => $oClient->id,
            //         'client_secret' => $oClient->secret,
            //         'username' => $email,
            //         'password' => $password,
            //         'scope' => '*',
            //     ],
            // ]);

            // return json_decode((string) $response->getBody(), true);

            $__user = new User();
            $user = $__user->where('email', $email)->first();

            // Creating a token without scopes...
            $token = $user->createToken('Token Name')->accessToken;

            return response()->json(["access_token" => $token], 201);


        }catch(Exception $ex) {
            return response()->json(["error" => "Sorry an error occurred "+$ex->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    public function forgotPassword(Request $request) {
        $request->validate([
            'token' => 'required',
            'email' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => bcrypt($password)
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        return $status === Password::PASSWORD_RESET
                    ? response()->json(["message" => "Şifre başarıyla sıfırlandı, giriş yapmaya devam edebilirsiniz"], 201)
                    : response()->json(["message" => "Şifre sıfırlanamadı, daha sonra tekrar deneyin"], 401);

    }

    public function checkEmail(Request $request) {

        $request->validate($rules = [

            'email' => 'required',

        ]);


        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
                    ? response()->json(["message" => "E-postanıza bir şifre sıfırlama bağlantısı gönderildi"], 201)
                    : response()->json(["message" => "Hesap bulunamadı"], 401);

    }

    public function updateProfile(Request $request) {
        $request->validate($rules = [

            'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:50048',

        ]);


        $user = Auth::user();
        if($request->hasFile('profile_picture')) {

            $extension = $request->File('profile_picture')->getClientOriginalExtension();
            $imagePath = 'profile_picture'. $user->id . '.'.$extension;
            $image_url = $request->File('profile_picture')->storeAs('public/profile', $imagePath);
            $image_url= 'storage'. substr($image_url,strlen('public'));
            $user->profile_img = asset($image_url);
            if($user->isDirty()) {

                $user->save();

            }
        }
        return response()->json(["message" => "profil resmi başarıyla güncellendi"], 201);
    }

    public function logout(Request $request) {

        $request->user()->token()->revoke();
        return response()->json(["message" => 'Başarıyla çıkış yapıldı'], 201);
    }

    public function genereteAvatar($user) {
        $profile_picture = (new Avatar)
            ->create(strtoupper($user->name))
            ->getImageObject()
            ->encode('png');


        Storage::disk('public')->put('profile' . $user->id . '/profile_picture.png',
            (string)$profile_picture);

        return Storage::url('profile'. $user->id . '/profile_picture.png');
    }

    // public function emailVerificationNotice() {

    //     return response()->json("hello there, check you email and click on the link sent by us to verify email", 401);
    // }

    public function emailVerificationHandler($verification_token) {

        $user = User::where("verification_token", $verification_token)->first();
        $frontendUrl = (env('FRONTEND_URL'))?env('FRONTEND_URL'): "https://oguzhansenyigit.com/";
        if(!$user){
            return redirect()
                ->away($frontendUrl.'auth/signup')
                ->with('status', 'geçersiz doğrulama jetonu veya kullanıcı zaten doğrulandı');
        }
        if($user->verified == 1) {

            return redirect()
                ->away($frontendUrl.'auth/login')
                ->with('status', 'Hesap zaten doğrulandı');
        }
        $user->verified = 1;
        $user->verification_token = null;
        $user->email_verified_at = now();
        $user->save();

        return redirect()
            ->away($frontendUrl.'auth/login')
            ->with('status', 'Hesap zaten doğrulandı');
    }


    public function resendingVerificationEmail(Request $request) {

        $request->validate([
            'email'=>'required'
        ]);
        $user = User::where('email', $request->email)->first();
        $frontendUrl = (env('FRONTEND_URL'))?env('FRONTEND_URL'): "https://vehicle-penalty-api.herokuapp.com/api/";

        if(!$user){
            return redirect()
                ->away($frontendUrl.'auth/signup')
                ->with('status', 'Geçersiz e-posta');
        }
        if($user->verified == 1) {

            return redirect()
                ->away($frontendUrl.'home')
                ->with('status', 'Hesap zaten doğrulandı');
        }

        $user->verification_token = Str::random(30);
        $user->save();
        event(new EmailVerification($user));
        return response()->json("Doğrulama e-postasının yeniden gönderilmesi başarılı oldu", 201);

    }
}
