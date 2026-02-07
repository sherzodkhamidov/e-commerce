<?php
try {
    $user = \App\Models\User::firstOrNew(['email' => 'admin@admin.com']);
    $user->name = 'Admin';
    $user->password = \Illuminate\Support\Facades\Hash::make('Web1234$');
    $user->save();
    echo "Admin user created/updated successfully.\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
