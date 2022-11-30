<?php

namespace App\Listeners;

use App\Events\EmailVerification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Notifications\Auth\VerifyEmailNotification;

class EmailVerificationNotification
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  EmailVerification  $event
     * @return void
     */
    public function handle(EmailVerification $event)
    {
        $user = $event->user;

        $user->notifyNow(new VerifyEmailNotification());
    }
}
