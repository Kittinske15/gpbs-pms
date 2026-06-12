import csv
import json
from datetime import datetime
import yfinance as yf

def csv_to_json(csv_file, json_file):
    with open(csv_file, 'r', encoding='utf-8') as csv_file:
        reader = csv.DictReader(csv_file, delimiter=',')

        data_list = []
        for row in reader:
            # print(row)
            date_object = datetime.strptime(row['Date'], '%Y-%m-%d')
            timestamp = int(date_object.timestamp()) * 1000  # Convert to milliseconds

            data_item = [
                timestamp,
                float(row['Open']),
                float(row['High']),
                float(row['Low']),
                float(row['Close']),
                float(row['Volume'])
            ]
            data_list.append(data_item)

    with open(json_file, 'w') as json_file:
        json.dump(data_list, json_file, indent=2)


# Import package

# Get the data
Name_list = ["0267.HK","1215.TW","2318.HK","3839.HK","8001.T","CPALL.BK","CPAXT.BK","CPF.BK","TRUE.BK", "PTT.BK"]
for Name in Name_list:

    data = yf.download(tickers=Name, period="1y", interval="1d")
    
    # Print the data
    print(data.tail())
    data.to_csv(Name+".csv")

    csv_to_json(Name+".csv", './'+Name)
