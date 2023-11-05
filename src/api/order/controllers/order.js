'use strict';

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
    async create(ctx) {
        const result = await super.create(ctx);


        const { default: axios } = require("axios");
        const { xenditHeaders } = require('../helpers/header.js');

        const payload = {
            external_id: result.data.id.toString(),
            payer_email: 'arifinjohan493@gmail.com',
            description: 'Payment for product',
            amount: result.data.attributes.totalPrice,
            success_redirect_url: 'https://docs.xendit.co/id/accounts',
        }

        const response = await axios({
            method: 'POST',
            url: 'https://api.xendit.co/v2/invoices',
            headers: xenditHeaders,
            data: JSON.stringify(payload)
        });

        let params = { 'data': { 'invoiceUrl': response.data['invoice_url'] } }

        let updateOrder = await strapi.service('api::order.order').update(parseInt(result.data.id.toString()), params);

        return JSON.stringify(response.data);
    }
}));
