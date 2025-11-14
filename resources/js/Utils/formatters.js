/**
 * Formata um valor numérico para o formato de moeda Real (BRL).
 * @param {number} value
 * @returns {string}
 */
export const currency = (value) => {
    if (typeof value !== 'number') {
        // Tenta converter para número, caso contrário, assume 0
        value = parseFloat(value) || 0;
    }
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};


// export const formatDate = (date) => new Date(date).toLocaleDateString('pt-BR');