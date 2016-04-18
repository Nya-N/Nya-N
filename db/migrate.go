package main
import (
	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
	"github.com/syo-sa1982/GoNTAkun/model"
	"os"
	"gopkg.in/yaml.v2"
	"io/ioutil"
	"log"
	"time"
)

var Events = []model.Event{
	model.Event{
		ID: 1,
		Name: "イベント名1",
		ImagePath: "img/150x150.png",
		Capacity: 250,
		StartDate: time.Now(),
		Description: "イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細",
	},
	model.Event{
		ID: 2,
		Name: "イベント名2",
		ImagePath: "img/150x150.png",
		Capacity: 250,
		StartDate: time.Now(),
		Description: "イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細",
	},
	model.Event{
		ID: 3,
		Name: "イベント名2",
		ImagePath: "img/150x150.png",
		Capacity: 250,
		StartDate: time.Now(),
		Description: "イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細",
	},
	model.Event{
		ID: 4,
		Name: "イベント名2",
		ImagePath: "img/150x150.png",
		Capacity: 250,
		StartDate: time.Now(),
		Description: "イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細",
	},
	model.Event{
		ID: 5,
		Name: "イベント名2",
		ImagePath: "img/150x150.png",
		Capacity: 250,
		StartDate: time.Now(),
		Description: "イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細",
	},
	model.Event{
		ID: 6,
		Name: "イベント名2",
		ImagePath: "img/150x150.png",
		Capacity: 250,
		StartDate: time.Now(),
		Description: "イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細",
	},
	model.Event{
		ID: 7,
		Name: "イベント名2",
		ImagePath: "img/150x150.png",
		Capacity: 250,
		StartDate: time.Now(),
		Description: "イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細",
	},
}


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

	log.Println("SkillCategory INSERT")
	for key := range Events {
		db.Create(&Events[key])
	}
	
	
}