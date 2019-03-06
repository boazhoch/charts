export default class Http {
    public async get(url: string) {
        return {
            ok: true,
            json: () => ({
                'Meta Data': {
                    '2. Symbol': 'ms'
                },
                'Time Series (Daily)': {
                    '2018-10-09': {
                        '4. close': '25'
                    },
                    '2018-10-10': {
                        '4. close': '50'
                    },
                    '2018-10-11': {
                        '4. close': '75'
                    },
                }
            })
        }
    }
}