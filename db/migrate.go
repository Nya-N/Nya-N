package main
import (
	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
	"github.com/syo-sa1982/GoNTAkun/model"
	"os"
	"gopkg.in/yaml.v2"
	"io/ioutil"
	"log"
)

func main() {
	yml, err := ioutil.ReadFile("conf/db.yaml")
	if err != nil {
		panic(err)
	}

	t := make(map[interface{}]interface{})

	_ = yaml.Unmarshal([]byte(yml), &t)

	conn := t[os.Getenv("GONTADB")].(map[interface{}]interface{})

	db, err := gorm.Open("mysql", conn["user"].(string)+conn["password"].(string)+"@/"+conn["db"].(string)+"?charset=utf8&parseTime=True")
	if err != nil {
		panic(err)
	}

	log.Println("Member")
	if db.HasTable(&model.Member{}) {
		db.DropTable(&model.Member{})
	}
	db.Set("gorm:table_options", "ENGINE=InnoDB DEFAULT CHARSET=utf8").CreateTable(&model.Member{})

	log.Println("Event")
	if db.HasTable(&model.Event{}) {
		db.DropTable(&model.Event{})
	}
	db.Set("gorm:table_options", "ENGINE=InnoDB DEFAULT CHARSET=utf8").CreateTable(&model.Event{})

	log.Println("Comment")
	if db.HasTable(&model.Comment{}) {
		db.DropTable(&model.Comment{})
	}
	db.Set("gorm:table_options", "ENGINE=InnoDB DEFAULT CHARSET=utf8").CreateTable(&model.Comment{})

	log.Println("Account")
	if db.HasTable(&model.Account{}) {
		db.DropTable(&model.Account{})
	}
	db.Set("gorm:table_options", "ENGINE=InnoDB DEFAULT CHARSET=utf8").CreateTable(&model.Account{})

	log.Println("GoogleAccount")
	if db.HasTable(&model.GoogleAccount{}) {
		db.DropTable(&model.GoogleAccount{})
	}
	db.Set("gorm:table_options", "ENGINE=InnoDB DEFAULT CHARSET=utf8").CreateTable(&model.GoogleAccount{})
}
