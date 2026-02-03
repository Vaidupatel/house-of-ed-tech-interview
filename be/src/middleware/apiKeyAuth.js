import ApiKey from '../models/apiKey.model.js';
import { errorResponse } from '../helpers/response.js';

const apiKeyAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return errorResponse(res, 9001, 'API key missing', 401);
        }

        const apiKeyValue = authHeader.split(' ')[1];

        const origin = req.headers.host || '';
        console.log('origin', origin)
        const apiKey = await ApiKey.findOne({ api_key: apiKeyValue });
        if (!apiKey) {
            return errorResponse(res, 9001, 'Invalid API key', 401);
        }


        if (apiKey.allowed_origin !== '*' && apiKey.allowed_origin !== origin) {
            return errorResponse(res, 9005, 'Origin not allowed', 403);
        }

        req.apiKey = apiKey;
        next();
    } catch (error) {
        console.error('API key auth error:', error);
        return errorResponse(res, 9999, error, 500);
    }
};

export default apiKeyAuth;
