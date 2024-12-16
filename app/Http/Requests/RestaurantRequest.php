<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RestaurantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'address' => ['required', 'string'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'phone' => ['required', 'string', 'max:20'],
            'cuisine_type' => ['required', 'string', 'max:50'],
            'is_active' => ['boolean'],
            'opening_time' => ['required', 'date_format:H:i'],
            'closing_time' => ['required', 'date_format:H:i', 'after:opening_time'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The restaurant name is required.',
            'address.required' => 'The restaurant address is required.',
            'latitude.between' => 'The latitude must be between -90 and 90.',
            'longitude.between' => 'The longitude must be between -180 and 180.',
            'phone.required' => 'The phone number is required.',
            'cuisine_type.required' => 'The cuisine type is required.',
            'opening_time.required' => 'The opening time is required.',
            'closing_time.required' => 'The closing time is required.',
            'closing_time.after' => 'The closing time must be after the opening time.',
        ];
    }
}
