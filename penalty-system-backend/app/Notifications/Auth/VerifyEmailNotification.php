<?php

namespace App\Notifications\Auth;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VerifyEmailNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        
        $url = url('/api/auth/verify-email/' . $notifiable->verification_token);
        return (new MailMessage)
                    
                ->subject('Hesabını onayla')
                ->greeting('Merhaba ' . ucwords($notifiable->name))
                ->line(env('APP_NAME') .
                    'de bir hesap açtınız, hesabınızı kullanabilmek için
                    buraya tıklayarak bunun e-posta adresiniz olduğunu doğrulamanız gerekiyor.')
                ->action('Hesabı Onaylayın
                ', url($url))
                ->salutation('Teşekkürler ' . env('APP_NAME') . ' EKİBİ');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'type' => 'Message',
            'content' => 'Hello ' . $notifiable->name. ' Welcome on board ',
            'time' => now()
        ];
    }
}
