import { existsSync } from "fs";
import test from 'tape';
import { parseAndGenerate } from "../../src";
import { Logger } from "../../src/utils/logger";
import { typecheck } from "../utils/tsc";
import { Project } from "ts-morph";

const target = "primitives";

test(target, async t => {
    Logger.disabled();

    const input = `./test/resources/${target}.wsdl`;
    const outdir = "./test/generated";

    t.test(`${target} - generate wsdl client`, async t => {
        await parseAndGenerate(input, outdir);
        t.end();
    });

    t.test(`${target} - check definitions`, async t => {
        t.equal(existsSync(`${outdir}/primitives/definitions/TnsrequestType.ts`), true);
        t.end();
    });

    t.test(`${target} - compile`, async t => {
        await typecheck(`${outdir}/primitives/index.ts`);
		t.end();
    });

    t.test(`${target} - RequestType`, async t => {
        const project = new Project()

        const requestType = project
            .addSourceFileAtPath(`${outdir}/primitives/definitions/TnsrequestType.ts`)
            .getInterfaceOrThrow("TnsrequestType");

        t.true(requestType.getPropertyOrThrow('stringElement')
            .getType()
            .isString(),
            "'stringProperty' should be of type string");

        t.true(requestType.getPropertyOrThrow('booleanElement')
                .getType()
                .isBoolean(),
            "'booleanProperty' should be of type boolean");

        t.true(requestType.getPropertyOrThrow('integerElement')
                .getType()
                .isNumber(),
            "'integerProperty' should be of type number");
        t.true(requestType.getPropertyOrThrow('decimalElement')
                .getType()
                .isNumber(),
            "'decimalProperty' should be of type number");
        t.true(requestType.getPropertyOrThrow('floatElement')
                .getType()
                .isNumber(),
            "'floatProperty' should be of type number");
        t.true(requestType.getPropertyOrThrow('doubleElement')
                .getType()
                .isNumber(),
            "'doubleProperty' should be of type number");

        t.end()
    })

});

