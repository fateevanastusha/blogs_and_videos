"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../app");
describe('auth', () => {
    //DELETE ALL DATA
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .delete('/testing/all-data')
            .expect(204);
    }));
    //SUCCESSFULLY CREATE USER
    let createResponseUser = null;
    it('SUCCESSFULLY CREATE NEW USER', () => __awaiter(void 0, void 0, void 0, function* () {
        createResponseUser = yield (0, supertest_1.default)(app_1.app)
            .post('/users')
            .send({
            login: "nastya",
            password: "qwerty",
            email: "anastasiafateeva2406@gmail.com"
        })
            .set({ Authorization: "Basic YWRtaW46cXdlcnR5" })
            .expect(201);
    }));
    //CHECK FOR CREATED USER
    it('SUCCESSFULLY CHECK FOR CREATED NEW USER WITH PAGINATION', () => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield (0, supertest_1.default)(app_1.app)
            .get('/users')
            .set({ Authorization: "Basic YWRtaW46cXdlcnR5" });
        expect(users.body).toStrictEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [
                {
                    id: createResponseUser.body.id,
                    login: "nastya",
                    email: "anastasiafateeva2406@gmail.com",
                    createdAt: expect.any(String)
                }
            ]
        });
    }));
    //UNSUCCESSFULLY AUTH WITH WRONG PASSWORD
    it('UNSUCCESSFULLY AUTH WITH WRONG PASSWORD', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .post('/auth')
            .send({
            loginOrEmail: "nastya",
            password: "WRONG PASSWORD"
        })
            .expect(404);
    }));
    let createResponsePost = null;
    it('SUCCESSFULLY CREATE NEW POST', () => __awaiter(void 0, void 0, void 0, function* () {
        createResponsePost = yield (0, supertest_1.default)(app_1.app)
            .post('/posts')
            .send({
            "title": "string",
            "shortDescription": "string",
            "content": "string",
            "blogId": createResponseUser.body.id
        })
            .set({ Authorization: "Basic YWRtaW46cXdlcnR5" })
            .expect(201);
    }));
    //CHECK FOR CREATED POST
    it('SUCCESSFULLY GET CREATED POST', () => __awaiter(void 0, void 0, void 0, function* () {
        const post = yield (0, supertest_1.default)(app_1.app)
            .get('/posts/' + createResponsePost.body.id);
        expect(post).toEqual({
            "title": "string",
            "shortDescription": "string",
            "content": "string",
            "blogId": createResponseUser.body.id,
            "blogName": createResponseUser.body.name,
            "createdAt": expect.any(String)
        });
    }));
    //SUCCESSFULLY AUTH
    let token = null;
    it('SUCCESSFULLY AUTH', () => __awaiter(void 0, void 0, void 0, function* () {
        token = yield (0, supertest_1.default)(app_1.app)
            .post('/auth/login')
            .send({
            loginOrEmail: "nastya",
            password: "qwerty"
        })
            .expect(200);
    }));
    //UNSUCCESSFULLY CREATE NEW COMMENT WITH WRONG TOKEN
    it('UNSUCCESSFULLY CREATE NEW COMMENT WITH WRONG TOKEN', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .post('/posts' + createResponsePost.body.id + '/comment')
            .send({
            content: 'too little'
        });
    }));
    //UNSUCCESSFULLY CREATE NEW COMMENT WITHOUT TOKEN
    //UNSUCCESSFULLY CREATE NEW COMMENT WITH WRONG DATA
    //SUCCESSFULLY CREATE NEW COMMENT
    //DELETE ALL DATA
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .delete('/testing/all-data')
            .set({ Authorization: "Basic YWRtaW46cXdlcnR5" })
            .expect(204);
    }));
});