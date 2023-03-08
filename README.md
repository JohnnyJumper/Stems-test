### Code Package README

This code package is a Go program that provides a basic book search functionality. The program searches for a given input string among three different groups of books, represented as slices of Book structs. The program uses the matchr library to calculate the Levenshtein distance between the input string and each book name. If the distance is less than 20 and the book name contains the input string, the book is considered a match.

### Installation and Setup

Install Go by following the instructions in the official documentation.
Clone the repository: git clone https://github.com/your-repository-url.git
Install dependencies by running go mod download.
Create a main_dataset.json file containing the data for the three book groups. The data should be in the following format:

```json
{
    "group1": [
        {
            "name": "Book name 1"
        },
        {
            "name": "Book name 2"
        },
        ...
    ],
    "group2": [
        {
            "name": "Book name 3"
        },
        {
            "name": "Book name 4"
        },
        ...
    ],
    "group3": [
        {
            "name": "Book name 5"
        },
        {
            "name": "Book name 6"
        },
        ...
    ]
}
```

Start the program by running go run main.go. The program will listen on http://localhost:6357.

### Usage

To search for books, send a GET request to /search/:input, where :input is the search string. The program will return a JSON response containing an array of book names that match the search string.

Example request:

```bash
Copy code
GET http://localhost:6357/search/love
```

Example response:

```python
Copy code
[
    "The Book of Love",
    "Love in the Time of Church"
]
```
