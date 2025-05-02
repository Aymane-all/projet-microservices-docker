<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\Slot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SlotController extends Controller
{
    public function index(Doctor $doctor)
    {
        return $doctor->slots;
    }

    public function store(Request $request, Doctor $doctor)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'is_available' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $slot = $doctor->slots()->create($request->all());
        return response()->json($slot, 201);
    }

    public function update(Request $request, Slot $slot)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'sometimes|required|date',
            'start_time' => 'sometimes|required|date_format:H:i',
            'end_time' => 'sometimes|required|date_format:H:i|after:start_time',
            'is_available' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $slot->update($request->all());
        return response()->json($slot);
    }

    public function destroy(Slot $slot)
    {
        $slot->delete();
        return response()->json(null, 204);
    }
} 