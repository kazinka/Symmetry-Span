import os
import pandas as pd
import statistics
import json

def nearAccuracy(recalled,correct):
    acc=0
    for ii in recalled:
        if (ii in correct):
            acc+=1
    
    return(acc)



##symetry span##
#currently makes table with rows based on set size. Do we want just a single row?
#span=pd.read_csv("data/WM_symmetry_span__1679329756389.csv")
#f=open("data/sampledata2.json")
#data=json.load(f)
#f.close()

#for i in data['displayedFields']:
#    print(i)

#displayedFields
#displayedValues
#labels
#values


with open("data/sampledata2.json") as jsonFile:
    data=json.load(jsonFile)
    jsonDataSpan = data['values']['SpatialSpan']
    jsonDataGrid = data['values']['TrailsAB']

##span##
#just trying to look at the data more closely
spanJson = json.loads(jsonDataSpan)

print(json.dumps(spanJson,sort_keys=True, indent=4))
    
#attempting to filter
span_dict = [x for x in spanJson if x['trial_type'] == 'spatial-span-recall']

for x in span_dict:
    print(x) 
    keys = x.keys()
    print(keys)
    values = x.values()
    print(values)

span=pd.json_normalize(span_dict)

## based on using pandas instead
res = pd.DataFrame(columns = ['setsize','meanRT', 'meanAccuracy','meanDistance','meanNearAccuracy'])

#need to turn strings (distance,recall, stimuli) into arrays 
for n in span.distance:
    print(n)
    #span.dist=span.distance[n].split(',') #nope

#this does not work
df= span.explode(list('distancerecallstimuli'))

#need to remove first two rows if they did the instructions (i.e., there are 8 rows)


for n in [3,4,5]:
    res=res.append({'setsize': n, 'meanRT': statistics.mean(span.rt.loc[span['set_size'] == n]),\
        'meanAccuracy': statistics.mean(span.accuracy.loc[span['set_size'] == n])/3,\
        'meanDistance': statistics.mean(span.distance.loc[span['set_size'] == n]),\
        'meanNearAccuracy': nearAccuracy(span.recall[span['set_size'] == n],span.stimuli[span['set_size'] == n])},\
            ignore_index = True)


##grid##
#just trying to look at the data more closely
gridJson = json.loads(jsonDataGrid)

grid_dict = [x for x in gridJson if x['trial_type'] == 'trails']

for x in gridJson: 
    keys = x.keys()
    print(keys)
    values = x.values()
    print(values)


grid=pd.json_normalize(grid_dict)
#currently makes table with each trail (A and B) as row. Do we want a single row?

#grid=pd.read_csv("data/Grid_trails_AB_test_1679347624736.csv")


res2= pd.DataFrame(columns = ['trailType','RT', 'numErrors','meanDistance'])

#need to turn strings missBoxValue, distance into arrays 

for n in ["A","B"]:

    res2=res2.append({'trailsType': n, 'RT': statistics.mean(grid.rt.loc[grid['trailsType'] == n]),\
        'numErrors': len(grid.missBoxValue.loc[grid['trailsType'] == n]),\
        'meanDistance': statistics.mean(grid.distance.loc[grid['trailsType'] == n])},\
            ignore_index = True)