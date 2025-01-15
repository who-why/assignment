import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Task {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  deadline: string;
  priority: string;
  completed: boolean;
}

interface TodoListProps {
  tasks: Task[];
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ tasks, toggleTaskCompletion, deleteTask }) => {
  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.taskContainer}>
          <Text
            style={[
              styles.taskText,
              item.completed && styles.completedTask,
            ]}
          >
            {item.title}
          </Text>
          <Text style={[styles.taskDescription,
             item.completed && styles.completedTask,
          ]}>{item.description}</Text>
          <Text style={styles.taskMeta}>Date-Time: {item.dateTime}</Text>
          <Text style={styles.taskMeta}>Deadline: {item.deadline}</Text>
          <Text>Priority: {item.completed ? 'Completed' : item.priority}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => toggleTaskCompletion(item.id)}
              style={[styles.toggleButton, item.completed && styles.completedButton]}
            >
              <Text style={styles.buttonText}>
                {item.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => deleteTask(item.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
};

export default TodoList;

const styles = StyleSheet.create({
  taskContainer: {
    padding: 20,
    marginVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    borderLeftWidth: 5,
    borderLeftColor: '#111312', 
    width: '100%',
  },
  taskText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  taskDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  taskMeta: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  priorityText: {
    fontSize: 14,
    color: '#FF5722',  
    fontWeight: '600',
    marginBottom: 10,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#B0BEC5',  
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  toggleButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  completedButton: {
    backgroundColor: '#FF9800',  
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

