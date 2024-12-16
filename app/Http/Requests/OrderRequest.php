<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'restaurant_id' => ['required', 'exists:restaurants,id'],
            'delivery_address' => ['required', 'string'],
            'delivery_latitude' => ['required', 'numeric', 'between:-90,90'],
            'delivery_longitude' => ['required', 'numeric', 'between:-180,180'],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'special_instructions' => ['nullable', 'string'],
        ];

        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules['status'] = ['sometimes', 'required', 'string', 'in:pending,confirmed,preparing,ready_for_pickup,picked_up,delivered,cancelled'];
            $rules['driver_id'] = ['sometimes', 'nullable', 'exists:drivers,id'];
            $rules['estimated_delivery_time'] = ['sometimes', 'nullable', 'date'];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'restaurant_id.required' => 'Please select a restaurant.',
            'restaurant_id.exists' => 'The selected restaurant is invalid.',
            'delivery_address.required' => 'Delivery address is required.',
            'delivery_latitude.between' => 'The latitude must be between -90 and 90.',
            'delivery_longitude.between' => 'The longitude must be between -180 and 180.',
            'total_amount.required' => 'Order total amount is required.',
            'total_amount.min' => 'Order total amount must be greater than 0.',
            'driver_id.exists' => 'The selected driver is invalid.',
        ];
    }
}
