<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ServicoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'descricao' => ['required', 'string', 'max:1000'],
            'valor' => ['required', 'numeric', 'min:0', 'max:99999999999999.99'],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'descricao.required' => 'O campo Descrição é obrigatório.',
            'descricao.string' => 'O campo Descrição deve ser uma string.',
            'descricao.max' => 'O campo Descrição não pode ter mais de :max caracteres.',
            'valor.required' => 'O campo Valor é obrigatório.',
            'valor.numeric' => 'O campo Valor deve ser um número.',
            'valor.min' => 'O campo Valor deve ser no mínimo :min.',
            'valor.max' => 'O campo Valor não pode ser maior que :max.',
        ];
    }
}