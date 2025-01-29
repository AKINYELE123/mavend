import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Switch } from 'react-native'
import  AntDesign  from 'react-native-vector-icons/AntDesign'


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
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  }

  const filteredTasks = tasks.filter(task =>
    filter === 'All' ? true : filter === "Completed" ? task.completed
      : !task.completed
  );



  return (
    <View style={[styles.container, darkMode && styles.darkContainer]}>

      <View style={styles.switchContainer}>
        <Text>{!darkMode ? "Dark Mode": "Light Mode"}</Text>
        <Switch value={darkMode} onValueChange={() => setDarkMode(!darkMode)} />
      </View>
      <TextInput
        style={[styles.input, darkMode && styles.darkInput]}
        placeholder='Enter task'
        value={taskText}
        onChangeText={setTasktext}
      />

      <TouchableOpacity onPress={addTask} style={[styles.addButton]}>
        <Text style={darkMode ? styles.darkAddText : styles.lightAddText}>Add</Text>
      </TouchableOpacity>

      <View style={styles.filterContainer}>
        {['All', 'Completed', 'Incomplete'].map(f => (
          <TouchableOpacity onPress={() => setFilter(f)} key={f}>
            <Text style={[styles.filterText, filter === f && styles.activeFilter,  darkMode && styles.darkText,]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <>
            <View style={[styles.taskContainer]}>
              <TouchableOpacity onPress={() => toggleTask(item.id)}>
                <AntDesign name={item.completed ? "checkcircle" : "checkcircleo"} size={24} color='green'/>
              </TouchableOpacity>
              <Text style={[styles.taskText, item.completed && styles.completedTask, darkMode && styles.darkText,]}>{item.text}</Text>
              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <AntDesign name='delete' color="red" size={24} />
              </TouchableOpacity>
            </View>
          </>
        )}
      />
    </View>
  )

}

const styles = StyleSheet.create({
  switchContainer: {flexDirection: "row", justifyContent: "space-between", alignItems: "center"},
  container: { flex: 1, padding: 20, backgroundColor: "#fff", paddingTop: 100 },
  darkContainer: { backgroundColor: "#333" },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 10, },
  darkInput: { backgroundColor: '#555', color: '#fff' },
  addButton: { backgroundColor: "blue", padding: 10, borderRadius: 10, alignItems: "center" },
  darkAddText: {color: "white"},
  lightAddText: {color: "white"},
  taskContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10, borderBottomWidth: 1 },
  taskText: { fontSize: 18  },
  completedTask: { textDecorationLine: "line-through", color: "gray" },
  filterContainer: { flexDirection: "row", justifyContent: "space-around", marginVertical: 10 },
  filterText: { fontSize: 16, color: "gray" },
  activeFilter: { color: 'blue', fontWeight: "Bold" },
  darkText: { color: 'white' },
})


export default App;