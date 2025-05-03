<?php

namespace Database\Seeders;

use App\Models\Doctor;
use Illuminate\Database\Seeder;

class DoctorSeeder extends Seeder
{
    public function run()
    {
        $doctors = [
            [
                'name' => 'Dr. John Smith',
                'specialty' => 'Cardiology',
                'email' => 'john.smith@medical.com',
                'phone' => '+33123456789',
                'location' => 'Paris',
                'description' => 'Experienced cardiologist with 15 years of practice',
                'photo' => 'doctors/john-smith.jpg'
            ],
            [
                'name' => 'Dr. Marie Dubois',
                'specialty' => 'Pediatrics',
                'email' => 'marie.dubois@medical.com',
                'phone' => '+33987654321',
                'location' => 'Lyon',
                'description' => 'Specialist in pediatric care',
                'photo' => 'doctors/marie-dubois.jpg'
            ],
        ];

        foreach ($doctors as $doctor) {
            Doctor::create($doctor);
        }
    }
}