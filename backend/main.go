package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"sort"
	"strings"

	"github.com/antzucaro/matchr"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)
	
type DataSet struct {
	Group1 []Book `json:"group1"`
	Group2 []Book `json:"group2"`
	Group3 []Book `json:"group3"`
}

type Book struct {
	Name string  `json:"name"`
}

type SearchResult struct {
	Name string
	distance int
}

var dataset DataSet;

func fillDataset(dataset *DataSet) (error) {
fmt.Println("Reading file main_dataset.json")
	data, err := os.ReadFile("main_dataset.json")
    if err != nil {
        return err
    }
	
	err = json.Unmarshal(data, dataset)
	if err != nil {
		return nil
	}

	return nil
}


func searchRoutine(input string, group []Book, output chan []SearchResult) {
	result := []SearchResult{}
	for _, book := range group {
		// check if similar then attach to result
		loweredInput, name := strings.ToLower(input), strings.ToLower(book.Name);
		distance := matchr.Levenshtein(loweredInput, name)
		
		if (distance < 20 && strings.Contains(name, loweredInput)) {
			result = append(result, SearchResult{Name: name, distance: distance});
		}
	}
	output <- result;
}


func search(input string) ([]string){
	comms := make(chan []SearchResult)
	go searchRoutine(input, dataset.Group1, comms)
	go searchRoutine(input, dataset.Group2, comms)
	go searchRoutine(input, dataset.Group3, comms)
	
	group1Result, group2Result, group3Result := <- comms, <- comms, <- comms


	searchResult := append(append(group1Result, group2Result...), group3Result...)
	sort.Slice(searchResult, func(i, j int) bool {
		return searchResult[i].distance < searchResult[j].distance
	})
	
	var top []SearchResult;

	if len(searchResult) < 5 {
		top = searchResult
	} else {
		top = searchResult[:5]
	}

	var returnee []string
	for _, searchResult := range top {
		returnee = append(returnee, searchResult.Name)
	}

	return returnee
}

func clearDuplicates(arr []string) []string {
    unique := make(map[string]bool)
    result := []string{}

    for _, str := range arr {
        if !unique[str] {
            result = append(result, str)
            unique[str] = true
        }
    }

    return result
}


func handler(context *gin.Context) (){
	err := fillDataset(&dataset)
	if err != nil {
		panic(err)
	}
	
	input := context.Param("input")
	rawSuggestions := search(input)
	suggestions := clearDuplicates(rawSuggestions)

	fmt.Println(suggestions);
	if len(suggestions) == 0 {
		context.IndentedJSON(http.StatusOK, gin.H{"message": "Book is not found"})
	} else {
		context.IndentedJSON(http.StatusOK, suggestions)
	}
}


func main() {
	router := gin.Default()
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000",}
	router.Use(cors.New(config))
	router.GET("/search/:input", handler)
	router.Run("localhost:6357")
}