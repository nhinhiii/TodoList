"use client"
import React, { useEffect, useState } from 'react';
import { Box, Button, Text, Input, List, ListItem, IconButton, HStack } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { FaArrowCircleUp, FaArrowAltCircleDown } from "react-icons/fa";
import { Checkbox, CheckboxGroup } from '@chakra-ui/react'

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  //load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } 
    }
  }, []); 

  //save
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  function addTask() {
    //empty string??
    if (newTask.trim()) {
      setTasks(task => [...task, newTask]);
      setNewTask("");
    }
  }

  function deleteTask(index) {
    setTasks(tasks.filter((_, i) => i !== index));
  }

  //check bound
  //up: > 0
  //down: < length - 1
  //swap
  function goUp(index) {
    if (index > 0) {
      const newArrTask = [...tasks];
      [newArrTask[index], newArrTask[index - 1]] = [newArrTask[index - 1], newArrTask[index]];
      setTasks(newArrTask);
    }
  }

  function goDown(index) {
    if (index < tasks.length - 1) {
      const newArrTask = [...tasks];
      [newArrTask[index], newArrTask[index + 1]] = [newArrTask[index + 1], newArrTask[index]];
      setTasks(newArrTask);
    }
  }

  return (
    <Box textAlign="center" mx="200px" my="100px" px={4}>
      <Text as='b' fontSize="5xl" fontFamily="Arial, sans-serif" mb={4}>To Do List</Text>
      <HStack mb={4} spacing={2}>
        <Input
          type="text"
          placeholder="Enter your task..."
          value={newTask}
          onChange={handleInputChange}
        />
        <Button onClick={addTask} colorScheme="teal">Add</Button>
      </HStack>

      <List spacing={3}>
        {tasks.map((task, index) => (
          <ListItem key={index} display="flex" alignItems="center" justifyContent="space-between" border="2px solid black" borderRadius="5px" p="10px">
            <Box alignItems="center" justifyContent="space-between" display="flex" m="5px">
              <Checkbox defaultChecked colorScheme ="green"></Checkbox>
              <Text as='b'>{task}</Text>
            </Box>
            
            <HStack spacing={2}>
              <IconButton
                icon={<DeleteIcon />}
                onClick={() => deleteTask(index)}
                size="sm"
                colorScheme="red"
              />
              <IconButton
                icon={<FaArrowCircleUp />}
                onClick={() => goUp(index)}
                size="sm"
                colorScheme="yellow"
              />
              <IconButton
                icon={<FaArrowAltCircleDown />}
                onClick={() => goDown(index)}
                size="sm"
                colorScheme="yellow"
              />
            </HStack>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default TodoList;