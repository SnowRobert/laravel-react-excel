<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\User\SearchUserController;
use App\Http\Controllers\User\UserVehicleController;
use App\Http\Controllers\User\UserMenuController;
use App\Http\Controllers\User\UserMenuItemController;
use App\Http\Controllers\User\UserPenaltyController;
use App\Http\Controllers\User\UserMenuDataController;
use App\Http\Controllers\User\UserExcelFileController;
use App\Http\Controllers\MenuItem\MenuItemController;
use App\Http\Controllers\Menu\MenuController;
use App\Http\Controllers\MenuData\SearchMenuDataController;
use App\Http\Controllers\Menu\MenuItemController as MenuEntryController;
use App\Http\Controllers\Menu\MenuDataController as Menu_MenuDataController;
use App\Http\Controllers\Vehicle\VehicleController;
use App\Http\Controllers\Vehicle\VehiclePenaltyController;
use App\Http\Controllers\Vehicle\SearchVehicleController;
use App\Http\Controllers\Penalty\PenaltyController;
use App\Http\Controllers\Penalty\SearchPenaltyController;
use App\Http\Controllers\SystemStatistics\SystemStatiticsController;
use App\Http\Controllers\ExcelFile\ExcelFileController;
use App\Http\Controllers\User\UserPdfFileController;
use App\Http\Controllers\pdf\PDFController;







/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group whichlicense-penalty
| is assigned the "api" middleware group. Enjoy building your API!
|
*/



Route::post('auth/signup', [AuthController::class, 'signup']);
    Route::post('auth/login', [AuthController::class, 'login']);
    Route::post('auth/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::get('auth/check-account', [AuthController::class, 'checkEmail']);
    Route::get('auth/verify-email/{verification_token}', [AuthController::class, 'emailVerificationHandler']);
    Route::get('auth/verification-resend', [AuthController::class, 'resendingVerificationEmail']);

    Route::middleware('auth:api')->group(function () {

        //authenticated user info
        Route::get('auth/user-details', [AuthController::class, 'userDetails']);
        Route::post('auth/logout', [AuthController::class, 'logout']);

        Route::middleware('verified')->group(function () {

            Route::post('auth/update-profile', [AuthController::class, 'updateProfile']);
            //users info

            Route::resource('users', UserController::class)->only(['show', 'index', 'update']);
            Route::post('users-search', [SearchUserController::class, 'index']);
            Route::resource('users.vehicle', UserVehicleController::class)->except(['edit', 'create', 'show']);
            Route::resource('users.penalty', UserPenaltyController::class)->except(['edit', 'create', 'show', 'update']);
            Route::post('users/{user_id}/penalty/{penalty_id}', [UserPenaltyController::class, 'update']);
            Route::post('users/penalty/delete', [UserPenaltyController::class, 'destroy']);
            Route::delete('users/{user_id}/delete/penalty/{penalty_id}', [UserPenaltyController::class, 'delete']);
            Route::delete('users/{id}', [UserController::class, 'delete']);

            Route::resource('users.menu', UserMenuController::class)->only(['store', 'destroy']);
            Route::resource('users.menu-item', UserMenuItemController::class)->only(['store', 'index']);
            Route::resource('users.menu-data', UserMenuDataController::class)->only(['store', 'update', 'destroy']);
            Route::resource('users.excel-file', UserExcelFileController::class)->only(['store', 'destroy']);
            Route::resource('menu-item', MenuItemController::class)->only(['index']);
            Route::resource('menu', MenuController::class)->only(['index', 'show']);
            Route::resource('menu.menu-item', MenuEntryController::class)->only(['index']);
            Route::resource('menu.menu-data', Menu_MenuDataController::class)->only(['index']);
            Route::resource('vehicle', VehicleController::class)->only(['index']);
            Route::get('all-vehicle-plates', [VehicleController::class, 'getAllPlateNumbers']);
            Route::post('vehicles-search', [SearchVehicleController::class, 'index']);
            Route::resource('penalty', PenaltyController::class)->only(['index']);
            Route::post('penalty-search', [SearchPenaltyController::class, 'index']);
            Route::resource('vehicle.penalty', VehiclePenaltyController::class)->only(['index']);
            Route::resource('statistics', SystemStatiticsController::class)->only(['index']);
            Route::resource('menu-data-search', SearchMenuDataController::class)->only(['index']);
            Route::resource('excel-file', ExcelFileController::class)->only(['index', 'show']);
            Route::resource('users.pdf-file', UserPdfFileController::class)->only(['store', 'destroy']);
            Route::resource('pdf-file', PDFController::class)->only(['index']);
            Route::get('pdf-file-search', [PDFController::class, 'search']);

            Route::get('license-penalty', [SystemStatiticsController::class, 'getLicensePenalty']);
            Route::get('directorate-fines', [SystemStatiticsController::class, 'getDirectorateFines']);

            Route::get('department-heads', [SystemStatiticsController::class, 'getDepartmentHeads']);
            Route::get('general-secretariats', [SystemStatiticsController::class, 'getGeneralSecretariats']);


        });




    });


    Route::fallback(function(){
        return response()->json([
            'message' => 'Page Not Found. If error persists, contact info@company.com'], 404);
    });
