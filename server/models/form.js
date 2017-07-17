import Joi from 'joi';

export default class Form {
    static get schema() {
        return Joi.object().keys({
            firstname: Joi.string().required().label('First name'),
            password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).label('Password'),
            email: Joi.string().email().label('Email')
        });
    }
}
