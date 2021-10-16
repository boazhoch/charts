import * as index from "./index"

// @ponicode
describe("getService", () => {
    let inst: any

    beforeEach(() => {
        inst = new index.default({ key0: {}, key1: {}, key2: {} })
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.getService("George")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            inst.getService("Pierre Edouard")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            inst.getService("Jean-Philippe")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            inst.getService("Anas")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            inst.getService("Edmond")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            inst.getService("")
        }
    
        expect(callFunction).not.toThrow()
    })
})
