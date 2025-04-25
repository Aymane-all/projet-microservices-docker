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
                'speciality' => 'Cardiology',
                'location' => 'Paris',
                'description' => 'Experienced cardiologist with 15 years of practice',
                'phone_number' => '+33123456789',
                'email' => 'john.smith@medical.com'
            ],
            [
                'name' => 'Dr. Marie Dubois',
                'speciality' => 'Pediatrics',
                'location' => 'Lyon',
                'description' => 'Specialist in pediatric care',
                'phone_number' => '+33987654321',
                'email' => 'marie.dubois@medical.com'
            ],
        ];

        foreach ($doctors as $doctor) {
            Doctor::create($doctor);
        }
    }
}
