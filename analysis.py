import os
import pandas as pd
import statistics

def nearAccuracy(recalled,correct):
    acc=0
    for ii in recalled:
        if (ii in correct):
            acc+=1
    
    return(acc)



##symetry span##
#currently makes table with rows based on set size. Do we want just a single row?
span=pd.read_csv("data/WM_symmetry_span__1679329756389.csv")

res = pd.DataFrame(columns = ['setsize','meanRT', 'meanAccuracy','meanDistance','meanNearAccuracy'])

#need to turn strings (distance,recall, stimuli) into arrays 
for n in span.distance:
   span.dist=span.distance[n].split(',')

for n in [3,4,5]:
    res=res.append({'setsize': n, 'meanRT': statistics.mean(span.rt.loc[span['set_size'] == n]),\
        'meanAccuracy': statistics.mean(span.accuracy.loc[span['set_size'] == n])/3,\
        'meanDistance': statistics.mean(span.distance.loc[span['set_size'] == n]),\
        'meanNearAccuracy': nearAccuracy(span.recall[span['set_size'] == n],span.stimuli[span['set_size'] == n])},\
            ignore_index = True)


##grid##
#currently makes table with each trail (A and B) as row. Do we want a single row?

grid=pd.read_csv("data/Grid_trails_AB_test_1679347624736.csv")


res2= pd.DataFrame(columns = ['trailType','RT', 'numErrors','meanDistance'])

#need to turn strings missBoxValue, distance into arrays 

for n in ["A","B"]:

    res2=res2.append({'trailsType': n, 'RT': statistics.mean(grid.rt.loc[grid['trailsType'] == n]),\
        'numErrors': len(grid.missBoxValue.loc[grid['trailsType'] == n]),\
        'meanDistance': statistics.mean(grid.distance.loc[grid['trailsType'] == n])},\
            ignore_index = True)