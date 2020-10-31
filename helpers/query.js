const { Op } = require('sequelize');

class QueryModel {
    page = 1;
    limit = 50;
    wheres = [];

    constructor(body) {
        this.process(body);
    }

    process(body) {
        if(body.where){
            this.processWhere(body.where);
        }
    }

    processWhere(data) {
        let params = data.split(';');
        for (const param of params) {
            let values = param.split(':');
            if(values.length == 3 && values[1] == 'like'){
                this.wheres.push({ key: values[0], type: 'like', value: '%' + values[2] + '%' });
            }
        }
    }

    whereToSequelize() {
        let params = {};
        for (const where of this.wheres) {
            if(where.type == 'like'){
                params[where.key] = {
                    [Op.like]: where.value
                };
            }
        }
        return params;
    }

    toSequelize() {
        return {
            where: this.whereToSequelize(),
            offset: 0,
            limit: 50
        };
    }
}

module.exports = { QueryModel };