import sys
import requests
from bs4 import BeautifulSoup
import json

url = sys.argv[1]
resp = requests.get('https://www.ralphlauren.com/men?webcat=men')  # https://www.ralphlauren.com/men?webcat=men
page_links = {}
page_links_arr = []
statusCode = 0


soup = BeautifulSoup(resp.text, "lxml")
soupfiltered = soup.findAll("div", {"id": "main"})
soup2 = BeautifulSoup(str(soupfiltered[0]), "lxml")

for link in soup2.findAll("a"):
    # page_links.update({"href": link.get('href')})
    href_list = link.get("href")
    r2 = requests.head(href_list)  #.head() if you want to act as a bot
    statusCode = r2.status_code

    if statusCode == 403:  # check for status code 403 and update to 200
        statusCode = 200

    page_links_arr.append({"href": link.get("href"), "statusCode": statusCode})

# Takes first name and last name via command
# line arguments and then display them
print(json.dumps(page_links_arr))
