import { expect } from 'chai';
import KeyPair from '../../src/crypto/keyPair';

describe('nem.crypto.keyPair tests', function() {

    it("Can create keypair from hex private key", function() {
        // Arrange:
        let privateKey = "c9fb7f16b738b783be5192697a684cba4a36adb3d9c22c0808f30ae1d85d384f";
        let expectedPublicKey = "ed9bf729c0d93f238bc4af468b952c35071d9fe1219b27c30dfe108c2e3db030";

        // Act:
        let kp = KeyPair.create(privateKey);

        // Assert:
        expect(kp.publicKey.toString()).equal(expectedPublicKey);
    });

    it("Can sign data with private key", function() {
        // Arrange:
        let privateKey = "abf4cf55a2b3f742d7543d9cc17f50447b969e6e06f5ea9195d428ab12b7318d";
        let expectedPublicKey = "8a558c728c21c126181e5e654b404a45b4f0137ce88177435a69978cc6bec1f4";
        let expectedSignature = "d9cec0cc0e3465fab229f8e1d6db68ab9cc99a18cb0435f70deb6100948576cd5c0aa1feb550bdd8693ef81eb10a556a622db1f9301986827b96716a7134230c";

        // Act:
        let kp = KeyPair.create(privateKey);
        let signature = kp.sign("8ce03cd60514233b86789729102ea09e867fc6d964dea8c2018ef7d0a2e0e24bf7e348e917116690b9").toString();

        // Assert:
        expect(kp.publicKey.toString()).equal(expectedPublicKey);
        expect(signature).equal(expectedSignature);
    });

    describe('Signature verification', function() {
        it("Can verify a signature", function() {
            // Arrange:
            let signer = "ed9bf729c0d93f238bc4af468b952c35071d9fe1219b27c30dfe108c2e3db030";
            let data = "NEM is awesome !";
            let signature = "f72d5abbf48a53e3c7c9c402bcb1b0a855821d5ef970dd5357b9899034d0c8dc177cef8e5924607ca325041b57db33628bd2f010c2474ff18fff7b509a1ca602";

            // Act & Assert:
            expect(KeyPair.verifySignature(signer, data, signature)).equal(true);
        });

        it("Return false if signature has invalid length", function() {
            // Arrange:
            let signer = "ed9bf729c0d93f238bc4af468b952c35071d9fe1219b27c30dfe108c2e3db030";
            let data = "NEM is awesome !";
            let signature = "f72d5abbf48a53e3c7c9c402bcb1b0a855821d5ef970dd5357b9899034d0c8dc177cef8e5924607ca325041b57db33628bd2f010c2474ff18";

            // Act & Assert:
            expect(KeyPair.verifySignature(signer, data, signature)).equal(false);
        });

        it("Return false if signature is not strictly hexadecimal", function() {
            // Arrange:
            let signer = "ed9bf729c0d93f238bc4af468b952c35071d9fe1219b27c30dfe108c2e3db030";
            let data = "NEM is awesome !";
            let signature = "f72d5abbf48a53e3c7c9c402bcb1b0a855821d5ef970dd5357b9899034d0c8dc177cef8e5924607ca325041b57db33628bd2f010c2474ff18fff7b509a1wwwww";

            // Act & Assert:
            expect(KeyPair.verifySignature(signer, data, signature)).equal(false);
        });

        it("Return false if wrong public key provided", function() {
            // Arrange:
            let signer = "0257b05f601ff829fdff84956fb5e3c65470a62375a1cc285779edd5ca3b42f6";
            let data = "NEM is awesome !";
            let signature = "f72d5abbf48a53e3c7c9c402bcb1b0a855821d5ef970dd5357b9899034d0c8dc177cef8e5924607ca325041b57db33628bd2f010c2474ff18fff7b509a1ca602";

            // Act & Assert:
            expect(KeyPair.verifySignature(signer, data, signature)).equal(false);
        });

        it("Return false if data is not corresponding to signature provided", function() {
            // Arrange:
            let signer = "ed9bf729c0d93f238bc4af468b952c35071d9fe1219b27c30dfe108c2e3db030";
            let data = "NEM is really awesome !";
            let signature = "f72d5abbf48a53e3c7c9c402bcb1b0a855821d5ef970dd5357b9899034d0c8dc177cef8e5924607ca325041b57db33628bd2f010c2474ff18";

            // Act & Assert:
            expect(KeyPair.verifySignature(signer, data, signature)).equal(false);
        });

        it("Return false if signature is not corresponding to data provided", function() {
            // Arrange:
            let signer = "ed9bf729c0d93f238bc4af468b952c35071d9fe1219b27c30dfe108c2e3db030";
            let data = "NEM is awesome !";
            let signature = "f67e5abbf48a53e3c7c9c402bcb1b0a855821d5ef970dd5357b9899034d0c8dc177cef8e5924607ca325041b57db33628bd2f010c2474ff18fff7b509a1eeacb";

            // Act & Assert:
            expect(KeyPair.verifySignature(signer, data, signature)).equal(false);
        });

        it("Throw error if signature verification is missing a parameter", function() {
            // Arrange:
            let signer = "ed9bf729c0d93f238bc4af468b952c35071d9fe1219b27c30dfe108c2e3db030";
            let data = "";
            let signature = "f72d5abbf48a53e3c7c9c402bcb1b0a855821d5ef970dd5357b9899034d0c8dc177cef8e5924607ca325041b57db33628bd2f010c2474ff18fff7b509a1wwwww";

            // Act & Assert:
            expect(function() { KeyPair.verifySignature(signer, data, signature) }).to.throw('Missing argument !');
        });

        it("Throw error if signature verification get an invalid sender public key", function() {
            // Arrange:
            let signer = "ed9bf729c0d93f238bc4af468b952c35071d9fe1219b27c30dfe108c2e3aedem";
            let data = "NEM is awesome !";
            let signature = "f72d5abbf48a53e3c7c9c402bcb1b0a855821d5ef970dd5357b9899034d0c8dc177cef8e5924607ca325041b57db33628bd2f010c2474ff18fff7b509a1wwwww";

            // Act & Assert:
            expect(function() { KeyPair.verifySignature(signer, data, signature) }).to.throw('Public key is not valid !');
        });
    });

});
