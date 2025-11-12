<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class ClienteRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'nome' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'cpf' => [
                'required',
                'string',
                'size:11',
                Rule::unique('clientes')->ignore($this->route('cliente')), // Ignora o próprio cliente ao atualizar
            ],
            'telefone' => ['nullable', 'string', 'max:12'],
            'sexo' => ['required', 'string', Rule::in(['M', 'F', 'O'])], // M, F ou Outro (O)
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'], // Max 2MB
            'ativo' => ['boolean'],
            'remove_image' => ['boolean'], // Para lidar com a remoção da imagem
        ];

        // Se for um POST (create), o email também deve ser único
        if ($this->isMethod('POST')) {
            $rules['email'][] = 'unique:clientes';
        } else { // Se for PUT/PATCH (update)
             $rules['email'][] = Rule::unique('clientes')->ignore($this->route('cliente'));
        }

        return $rules;
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nome.required' => 'O campo nome é obrigatório.',
            'nome.string' => 'O campo nome deve ser uma string.',
            'nome.max' => 'O campo nome não pode ter mais de :max caracteres.',
            'email.email' => 'O campo e-mail deve ser um endereço de e-mail válido.',
            'email.unique' => 'Este e-mail já está em uso por outro cliente.',
            'cpf.required' => 'O campo CPF é obrigatório.',
            'cpf.string' => 'O campo CPF deve ser uma string.',
            'cpf.size' => 'O campo CPF deve ter 11 caracteres.',
            'cpf.unique' => 'Este CPF já está em uso por outro cliente.',
            'telefone.max' => 'O campo telefone não pode ter mais de :max caracteres.',
            'sexo.required' => 'O campo sexo é obrigatório.',
            'sexo.in' => 'O campo sexo deve ser M, F ou O.',
            'image.image' => 'O arquivo deve ser uma imagem.',
            'image.mimes' => 'A imagem deve ser dos tipos: :values.',
            'image.max' => 'A imagem não pode ter mais de :max kilobytes.',
        ];
    }
}
