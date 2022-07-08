import _ from 'lodash';

export const toggleArray = (arr: Array<String>, string: string) => {
    if (arr.indexOf(string) === -1) {
      return [...arr, string]
    } else {
      return arr.filter(item => item !== string)
    }
  }

export const lodashToggle = (array, item) => _.xor(array, [item])

export const toggleArrayLocations = (arr: Array<Object>, location: Object) => {
  let alreadyIn = false;
  let index = -1;
  for (var i = 0; i < arr.length; i++){
    if (_.isEqual(arr[i], location)){
      alreadyIn = true;
      index = i;
      break;
    }
  }

  if (alreadyIn){
    arr.splice(index, 1);
    return arr
  } else {
    return [...arr, location]
  }
}

export const addItemToArray = (arr: Array<String>, string: string) => {
    return [...arr, string]
  }

export const removeItemFromArray = (arr: Array<String>, string: string) => {
    return arr.filter(item => item !== string)
}

export const uniq = a => [...new Set(a)]


export const getObjectbyId = (list, id) => {
  let obj = null
  list.map(element => {
    if (element['id'] == id)
      obj = element
  })
  return obj
}

export const getObjectInListbyFieldValue = (list, field, value) => {
  let obj = null
  list.map(element => {
    if (element[field] == value)
      obj = element
  })
  return obj
}

export const toggleArrayDictById= (arr: Array<Object>, obj: Object) => {
  let alreadyIn = false;
  let index = -1;

  for (var i = 0; i < arr.length; i++){
    if (arr[i].id === obj.id){
      alreadyIn = true;
      index = i;
      break;
    }
  }

  if (alreadyIn){
    arr.splice(index, 1);
    return arr
  } else {
    return [...arr, obj]
  }
}

export function replaceItemInDictArrayById(list, item) {
  const itemInList = getObjectbyId(list, item.id)
  const index = list.indexOf(itemInList)
  list = [
    ...list.slice(0, index),
    item,
    ...list.slice(index + 1)
  ]
  return list
}

export function getToday() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;
  return today
}

export function jsDateTimeToStr (jsDate) {
  let dd = String(jsDate.getDate()).padStart(2, '0');
  let mm = String(jsDate.getMonth() + 1).padStart(2, '0');
  let yyyy = jsDate.getFullYear();
  let hours = jsDate.getHours();
  let minutes = jsDate.getMinutes() > 9 ? jsDate.getMinutes(): '0' + jsDate.getMinutes();
  return yyyy + '-' + mm + '-' + dd + 'T' + hours + ':' + minutes
  
}

export function jsDateTimeToStrDate (jsDate) {
  let dd = String(jsDate.getDate()).padStart(2, '0');
  let mm = String(jsDate.getMonth() + 1).padStart(2, '0');
  let yyyy = jsDate.getFullYear();
  return yyyy + '-' + mm + '-' + dd 
  
}