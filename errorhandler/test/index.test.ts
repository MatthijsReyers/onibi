import { errorHandlerBuilder, BuilderOptions } from './../src/index';
import { Http415Error } from '@onibi/errors';
import express from 'express';
import { Express, Request, Response } from 'express';
import 'mocha';
import supertest from 'supertest';
import { expect } from 'chai';

var app: Express;

describe('Https errors', () => {

    before(() => {
        app = express();

        app.get('/test415', (req, res, next) => {
            next(new Http415Error());
        });

        app.use(errorHandlerBuilder({
            includeStackTrace: false,
            generate404: true
        }));

    });

    it('should be caught and returned as JSON', async () => {
        let res = await supertest(app).get('/test415');
        expect(res.status).to.equal(415);
        expect(res.headers["content-type"]).to.match(/json/);
        expect(res.body['errorType']).to.equal('415Unsupported');
    });

    it('should be created automatically for non existing paths', async () => {
        let res = await supertest(app).get('/annemijn');
        // console.log(res)
        expect(res.status).to.equal(404);
        expect(res.headers["content-type"]).to.match(/json/);
        expect(res.body['errorType']).to.equal('404NotFound');
    })
});

describe('Stack traces', () => {

    it('should not be included by default', async () => {
        app = express();

        app.get('/error', (req, res) => {
            throw new Error("Wow this is an error");
        });
        
        app.use(errorHandlerBuilder({
            generate404: true,
            logNonHttpErrors: false
        }));

        let res = await supertest(app).get('/error');
        expect(res.status).to.equal(500);
        expect(res.headers["content-type"]).to.match(/json/);
        expect(res.body['errorType']).to.equal('500Internal');
        expect(res.body['stackTrace']).to.be.undefined;
    });

    it('should be included if set to true', async () => {
        
        process.env['NODE_ENV'] = 'development';
        
        app = express();

        app.get('/error', (req, res) => {
            throw new Error("Wow this is an error");
        });
        
        app.use(errorHandlerBuilder({
            generate404: true,
            logNonHttpErrors: false,
            includeStackTrace: true
        }));

        let res = await supertest(app).get('/error');
        expect(res.status).to.equal(500);
        expect(res.headers["content-type"]).to.match(/json/);
        expect(res.body['errorType']).to.equal('500Internal');
        expect(res.body['stackTrace'].length > 10).to.be.true;
    })
});
