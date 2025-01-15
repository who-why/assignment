import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import TodoList from './todoList';
import { useUser } from '@clerk/clerk-expo';

interface Task {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  deadline: string;
  priority: string;
  completed: boolean;
}

const Todo = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Todo');
  const [isDateTimePickerVisible, setDateTimePickerVisibility] = useState(false);
  const [isDeadlinePickerVisible, setDeadlinePickerVisibility] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const { isSignedIn } = useUser();

  const addTask = () => {
    if (!isSignedIn) {
      Alert.alert('Sign In Required', 'Please sign in to add a task.');
      return;
    }

    if (!title || !description || !dateTime || !deadline) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      dateTime,
      deadline,
      priority,
      completed: false,
    };

    setTasks([...tasks, newTask]);

    // Reset input fields
    setTitle('');
    setDescription('');
    setDateTime('');
    setDeadline('');
    setPriority('Todo');
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id)),
        },
      ]
    );
  };

  const handleConfirmDateTime = (selectedDate: Date) => {
    setDateTime(selectedDate.toLocaleString());
    setDateTimePickerVisibility(false);
  };

  const handleConfirmDeadline = (selectedDate: Date) => {
    setDeadline(selectedDate.toLocaleDateString());
    setDeadlinePickerVisibility(false);
  };

  // Filter tasks based on search query and date range
  const filteredTasks = tasks.filter((task) => {
    const taskDate = new Date(task.dateTime);
    const startDateValid = startDate ? taskDate >= new Date(startDate) : true;
    const endDateValid = endDate ? taskDate <= new Date(endDate) : true;
    const searchValid = task.title.toLowerCase().includes(searchQuery.toLowerCase());

    return startDateValid && endDateValid && searchValid;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Todo List</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity onPress={() => setDateTimePickerVisibility(true)}>
        <TextInput
          style={styles.input}
          placeholder="Select Date-Time"
          value={dateTime}
          editable={false}
        />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDateTimePickerVisible}
        mode="datetime"
        onConfirm={handleConfirmDateTime}
        onCancel={() => setDateTimePickerVisibility(false)}
      />

      <TouchableOpacity onPress={() => setDeadlinePickerVisibility(true)}>
        <TextInput
          style={styles.input}
          placeholder="Select Deadline"
          value={deadline}
          editable={false}
        />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDeadlinePickerVisible}
        mode="date"
        onConfirm={handleConfirmDeadline}
        onCancel={() => setDeadlinePickerVisibility(false)}
      />

      <TextInput
        style={styles.input}
        placeholder="Priority"
        value={priority}
        onChangeText={setPriority}
      />

      <Button title="Add Task" onPress={addTask} />

      {/* Date range filter inputs */}
      <View style={styles.filterContainer}>
        <Text>Select Start Date</Text>
        <TouchableOpacity onPress={() => setDateTimePickerVisibility(true)}>
          <TextInput
            style={styles.input}
            placeholder="Start Date"
            value={startDate}
            editable={false}
          />
        </TouchableOpacity>

        <Text>Select End Date</Text>
        <TouchableOpacity onPress={() => setDateTimePickerVisibility(true)}>
          <TextInput
            style={styles.input}
            placeholder="End Date"
            value={endDate}
            editable={false}
          />
        </TouchableOpacity>
      </View>

      {/* Search input */}
      <TextInput
        style={styles.input}
        placeholder="Search tasks"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <TodoList
        tasks={filteredTasks} 
        toggleTaskCompletion={toggleTaskCompletion}
        deleteTask={deleteTask}
      />
    </View>
  );
};

export default Todo;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 8,
    marginVertical: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  filterContainer: {
    marginVertical: 15,
    width: '100%',
  },
});
