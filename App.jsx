import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, TextIput, FlatList, StyleSheet, TextInput, TouchableOpacity, Switch } from 'react-native'
import {AntDesign} from 'react-native-vector-icons'


const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTasktext] = useState('');
  const [filter, setFilter] = useState('All');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [tasks])


  const loadTasks = async () => {
    const storedTasks = await AsyncStorage.getItem('tasks');
    if (storedTasks) setTasks(JSON.parse(storedTasks))
  }

  const saveTasks = async () => {
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks))
  }

  const addTask = () => {
    if (taskText.trim() === '') return;
    setTasks([...tasks, { id: Date.now(), text: taskText, completed: false }]);
    setTasktext('');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(task = task.id === id ? { ...task, completed: !task.completed } : task))
  }

  const filteredTasks = tasks.filter(task =>
    filter === 'All' ? true : filter === "Completed" ? task.completed
      : !task.completed
  );



  return (
    <View style={[styles.container]}>

      <Switch value={darkMode} onValueChange={() => setDarkMode(!darkMode)} />
      <TextInput
        style={[styles.input]}
        placeholder='Enter task'
        value={taskText}
        onChangeText={setTasktext}
      />

      <TouchableOpacity onPress={addTask} style={[styles.addButton]}>
        <Text style>Add</Text>
      </TouchableOpacity>

      <View style={styles.filterContainer}>
        {['All', 'Completed','Incomplete'].map(f => (
          <TouchableOpacity onPress={() => setFilter(f)} key={f}>
            <Text style={[styles.filterText, filter === f && styles.activeFilter]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
      data={filteredTasks}
      keyExtractor={item => item.id.stringify()}
      renderItem={({item}) => (
        <View style={[styles.taskContainer]}>
          <TouchableOpacity onPress={() => toggleTask(item.id)}>
            <AntDesign name={item.completed ? "checkcircle" : "checkcircleo"} size={25}/>
          </TouchableOpacity>
          <Text style={[styles.taskText, item.completed && styles.completedTask]}>{item.text}</Text>
          <TouchableOpacity onPress={() => deleteTask(item.id)}>
            <AntDesign name='delete' color="red" size={25}/>
          </TouchableOpacity>
        </View>
      )}
      />
    </View>
  )

}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", paddingTop: 100 },
  darkContainer: { backgroundColor: "#333" },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 10, },
  addButton: { backgroundColor: "blue", padding: 10, borderRadius: 10, alignItems: "center" },
  taskContainer: {flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10, borderBottomWidth: 1}, 
  taskText: {fontSize: 18},
  completedTask: {textDecorationLine: "line-through", color: "gray"},
  filterContainer: {flexDirection: "row", justifyContent: "space-around", marginVertical: 10},
  filterText: {fontSize: 16, color: "gray"},
  activeFilter: {color: 'blue', fontWeight: "Bold"}
})


export default App;