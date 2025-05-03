<?php

namespace Database\Seeders;

use App\Models\Doctor;
use App\Models\Slot;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class SlotSeeder extends Seeder
{
    public function run()
    {
        $doctors = Doctor::all();

        foreach ($doctors as $doctor) {
            // Create slots for the next 7 days
            for ($i = 0; $i < 7; $i++) {
                $date = Carbon::now()->addDays($i);
                
                // Morning slots
                $this->createSlot($doctor, $date, '09:00', '09:30');
                $this->createSlot($doctor, $date, '09:30', '10:00');
                $this->createSlot($doctor, $date, '10:00', '10:30');
                
                // Afternoon slots
                $this->createSlot($doctor, $date, '14:00', '14:30');
                $this->createSlot($doctor, $date, '14:30', '15:00');
                $this->createSlot($doctor, $date, '15:00', '15:30');
            }
        }
    }

    private function createSlot($doctor, $date, $startTime, $endTime)
    {
        Slot::create([
            'doctor_id' => $doctor->id,
            'date' => $date->format('Y-m-d'),
            'start_time' => $startTime,
            'end_time' => $endTime,
            'is_available' => true
        ]);
    }
}