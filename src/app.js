const Base32 = require('hi-base32'); // Install with 'npm install hi-base32'
const otpauth_migration = require('./otpauth-migration_pb'); // Is compiled with the command (works on linux) 'protoc --js_out=import_style=commonjs,binary:. ./otpauth-migration.proto' and the .proto file from 'https://github.com/digitalduke/otpauth-migration-decoder/blob/master/src/otpauth-migration.proto'

const otpauth_migration_format = 'otpauth-migration://offline?data='; // This is what needs to be replaced from the input with an empty string
const Algorithm = {
    1: 'SHA1',
    2: 'SHA256',
    3: 'SHA512',
    4: 'MD5',
};
const DigitCount = {
    1: '6',
    2: '8',
};
const OtpType = {
    1: 'hotp',
    2: 'totp',
};

const input = "otpauth-migration://offline?data=CjEKCkhlbGxvId6tvu8SGEV4YW1wbGU6YWxpY2VAZ29vZ2xlLmNvbRoHRXhhbXBsZTAC"; // The Input. Obviously.

const uriDecoded = decodeURIComponent(input.replace(otpauth_migration_format, '')); // Replacing function to get only the data and use decodeURIComponent() to decode Percent-encoding. We are left with an base64 string.
const protobufDecoded = otpauth_migration.Payload.deserializeBinary(uriDecoded).array[0]; // Here happens the real magic, the base64 string to an array of OTPs.
const otpDecode = (otpArray) => otpArray.map(otp => { // Map the OTPs array
    const otp_type = OtpType[otp[5] || 1],
        otp_name = otp[1],
        otpParams = {
            Algorithm: Algorithm[otp[3] || 1],
            DigitCount: DigitCount[otp[4] || 1],
            Issuer: otp[2],
            Period: 30,
            Secret: Base32.encode(Buffer.from(otp[0]))
        },
        otp_params = [
            `algorithm=${otpParams.Algorithm}`,
            `digits=${otpParams.DigitCount}`,
            `issuer=${otpParams.Issuer}`,
            `period=${otpParams.Period}`,
            `secret=${otpParams.Secret}`
        ].join('&'),
        otpauth = `otpauth://${otp_type}/${otp_name}?${otp_params}`; //Put together the otpauth link
    return otpauth;
})

console.log(otpDecode(protobufDecoded)); // Évoilà, there we have our exportet/transfered Google Authenticator OTPs
// Expected output: ['otpauth://totp/Example:alice@google.com?algorithm=SHA1&digits=6&issuer=Example&period=30&secret=JBSWY3DPEHPK3PXP']