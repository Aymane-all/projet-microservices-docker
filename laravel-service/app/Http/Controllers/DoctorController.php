<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DoctorController extends Controller
{
    public function index()
    {
        return Doctor::all();
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email|unique:doctors',
            'phone' => 'required|string',
            'specialty' => 'required|string',
            'location' => 'required|string',
            'description' => 'nullable|string',
            'photo' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $doctor = Doctor::create($request->all());
        return response()->json($doctor, 201);
    }

    public function show(Doctor $doctor)
    {
        return $doctor;
    }

    public function update(Request $request, Doctor $doctor)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string',
            'email' => 'sometimes|required|email|unique:doctors,email,' . $doctor->id,
            'phone' => 'sometimes|required|string',
            'specialty' => 'sometimes|required|string',
            'location' => 'sometimes|required|string',
            'description' => 'nullable|string',
            'photo' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $doctor->update($request->all());
        return response()->json($doctor);
    }

    public function destroy(Doctor $doctor)
    {
        $doctor->delete();
        return response()->json(null, 204);
    }

    public function search(Request $request)
    {
        $query = Doctor::query();

        if ($request->has('specialty')) {
            $query->where('specialty', 'like', '%' . $request->specialty . '%');
        }

        if ($request->has('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        if ($request->has('available')) {
            $query->whereHas('slots', function ($q) {
                $q->where('is_available', true);
            });
        }

        return $query->get();
    }
} 