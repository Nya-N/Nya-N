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

//var members = []model.Member{
//	{ID:1,Name:"俺",Status:1},
//	{ID:2,Name:"誰",Status:0},
//	{ID:3,Name:"お前",Status:0},
//	{ID:4,Name:"やつ",Status:0},
//}

var events = []model.Event{
	{
		Name: "イベント名1",
		ImagePath: "img/150x150.png",
		Capacity: 250,
		Members: []model.Member{
			{Name:"俺",Status:1},
			{Name:"誰",Status:0},
			{Name:"お前",Status:0},
			{Name:"やつ",Status:0},
		},
		Comments: []model.Comment{
			{Name:"俺",Body:"私だ"},
			{Name:"ナイフパーティのうるさい方",Body:"お前だったのか"},
		},
		StartDate: time.Now(),
		Description: "イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細イベント1の詳細",
	},
	{
		Name: "イベント名2",
		ImagePath: "img/150x150.png",
		Capacity: 250,
		Members: []model.Member{
			{Name:"俺",Status:1},
			{Name:"誰",Status:0},
			{Name:"お前",Status:0},
			{Name:"やつ",Status:0},
		},
		Comments: []model.Comment{
			{Name:"俺",Body:"私だ"},
			{Name:"ナイフパーティのうるさい方",Body:"お前だったのか"},
		},
		StartDate: time.Now(),
		Description: "イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細",
	},
	{
		Name: "イベント名3",
		ImagePath: "img/150x150.png",
		Capacity: 250,
		Members: []model.Member{
			{Name:"俺",Status:1},
			{Name:"誰",Status:0},
			{Name:"お前",Status:0},
			{Name:"やつ",Status:0},
		},
		Comments: []model.Comment{
			{Name:"俺",Body:"私だ"},
			{Name:"ナイフパーティのうるさい方",Body:"お前だったのか"},
		},
		StartDate: time.Now(),
		Description: "イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細イベント2の詳細",
	},
	{
		Name: "イベント名4",
		ImagePath: "img/150x150.png",
		Capacity: 250,
		Members: []model.Member{
			{Name:"俺",Status:1},
			{Name:"誰",Status:0},
			{Name:"お前",Status:0},
			{Name:"やつ",Status:0},
		},
		Comments: []model.Comment{
			{Name:"俺",Body:"私だ"},
			{Name:"ナイフパーティのうるさい方",Body:"お前だったのか"},
		},
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

	log.Println(conn)

	// DBUtilに関数作りたい
	db, err := gorm.Open("mysql", conn["user"].(string)+conn["password"].(string)+"@/"+conn["db"].(string)+"?charset=utf8&parseTime=True")
	if err != nil {
		panic(err)
	}

	// ここにファイルをしてもらって個別に追加できるようにしたい
//	for _, s := range members {
//		db.Create(&s)
//	}
	for _, s := range events {
		db.Create(&s)
	}
}
