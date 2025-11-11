<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ordens', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('usuario_id')
				->unsigned()
				->nullable();
			$table->foreign('usuario_id')
				->references('id')
				->on('usuarios')
                ->onDelete('set null');
            $table->bigInteger('cliente_id')
				->unsigned()
				->nullable();
			$table->foreign('cliente_id')
				->references('id')
				->on('clientes')
                ->onDelete('cascade');
            $table->double('total', 16, 2)
                ->comment('Valor total dos serviços.')
                ->default(0);
            $table->dateTime('data')
                ->nullable();
            $table->string('status', 20)->default("Iniciado");
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('ordem_de_servicos', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('servico_id')
				->unsigned()
				->nullable();
			$table->foreign('servico_id')
				->references('id')
				->on('servicos')
                ->onDelete('cascade');
            $table->bigInteger('ordem_id')
				->unsigned()
				->nullable();
			$table->foreign('ordem_id')
				->references('id')
				->on('ordens')
                ->onDelete('cascade');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //desabilitando as chaves estrangeiras:
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('ordem_de_servicos');
        Schema::dropIfExists('ordens');
        //habilitando as chaves:
        Schema::enableForeignKeyConstraints();
    }
};
