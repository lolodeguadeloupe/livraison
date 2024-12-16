<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'restaurant_rating' => ['required', 'integer', 'between:1,5'],
            'restaurant_comment' => ['nullable', 'string', 'max:500'],
            'delivery_rating' => ['nullable', 'integer', 'between:1,5'],
            'delivery_comment' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'restaurant_rating.required' => 'Please rate the restaurant.',
            'restaurant_rating.between' => 'Restaurant rating must be between 1 and 5.',
            'delivery_rating.between' => 'Delivery rating must be between 1 and 5.',
            'restaurant_comment.max' => 'Restaurant comment cannot exceed 500 characters.',
            'delivery_comment.max' => 'Delivery comment cannot exceed 500 characters.',
        ];
    }
}
