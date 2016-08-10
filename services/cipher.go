package services

import (
	"crypto/aes"
	"crypto/cipher"
	"fmt"
	"encoding/base64"
)

// [必須]
// IVとkeyは本番環境では変えてね(コミットもしちゃだめよ)！ファイル化して読み込むようにした方が面倒じゃないか・・
// IVは16byte、keyは32byteで
var commonIV = []byte{0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f}
var key =  "iz~amc191_47y&p!#4+533+f0a+)~mi9"

// 暗号化
// 平文をAEC-256+CFBモードで暗号し、Base64でエンコードした文字列を返す
func EncrypterBase64(plainText string) string  {

	// byte配列に変換
	plainByteText := []byte(plainText)

	// 暗号化アルゴリズムaesを作成
	ci, _ := aes.NewCipher([]byte(key))
	//暗号化文字列
	cfb := cipher.NewCFBEncrypter(ci, commonIV)
	cipherText := make([]byte, len(plainByteText))
	cfb.XORKeyStream(cipherText, plainByteText)
	fmt.Printf("Cipher text: %x \n", string(cipherText))
	// Base64エンコード
	cipherTextBase64 := base64.StdEncoding.EncodeToString(cipherText)

	return  cipherTextBase64
}

// 複合
// AEC-256+CFBモードで暗号し、Base64でエンコードした文字列から平文を返す
func DecrypterBase64(cipherTextBase64 string) string  {

	// base64デコード
	cipherText, _ := base64.StdEncoding.DecodeString(cipherTextBase64) //[]byte

	// 暗号化アルゴリズムaesを作成
	ci, _ := aes.NewCipher([]byte(key))
	// 復元文字列
	cfbDec := cipher.NewCFBDecrypter(ci, commonIV)
	plainByteText := make([]byte, len(cipherText))
	cfbDec.XORKeyStream(plainByteText, cipherText)
	plainText := string(plainByteText)

	return plainText
}


