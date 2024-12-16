<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DriverRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'vehicle_type' => ['required', 'string', 'max:50'],
            'vehicle_number' => ['required', 'string', 'max:20'],
            'license_number' => ['required', 'string', 'max:50'],
            'is_available' => ['boolean'],
            'is_verified' => ['boolean'],
            'current_latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'current_longitude' => ['nullable', 'numeric', 'between:-180,180'],
        ];
    }

    public function messages(): array
    {
        return [
            'vehicle_type.required' => 'The vehicle type is required.',
            'vehicle_number.required' => 'The vehicle number is required.',
            'license_number.required' => 'The license number is required.',
            'current_latitude.between' => 'The latitude must be between -90 and 90.',
            'current_longitude.between' => 'The longitude must be between -180 and 180.',
        ];
    }
}
