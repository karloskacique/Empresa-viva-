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
        Schema::create('pagamentos', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('ordem_id')
				->unsigned()
				->nullable();
			$table->foreign('ordem_id')
				->references('id')
				->on('ordens')
				->onDelete('set null')
				->onUpdate('set null');
            $table->enum('forma_de_pagamento', [
				'debito',
				'credito',
				'pix',
			])
				->default('credito');
            $table->dateTime('data_pagamento')
                ->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pagamentos');
    }
};
