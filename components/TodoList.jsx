"use client"
import React, { useEffect, useState } from 'react';
import { Box, Button, Text, Input, List, ListItem, IconButton, HStack, Menu, MenuButton, MenuList, MenuItem, Flex, VStack } from '@chakra-ui/react';
import { DeleteIcon, ChevronDownIcon, EditIcon } from '@chakra-ui/icons';
import { FaArrowCircleUp, FaArrowAltCircleDown } from "react-icons/fa";
import { Checkbox } from '@chakra-ui/react'

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [action, setAction] = useState("All");

  //load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTasks = localStorage.getItem('tasks');
      //error forgot to convert to String 
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        const updatedTasks = parsedTasks.map(task => typeof task === 'string' ? { text: task, checked: false} : task); 
        setTasks(updatedTasks);
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
      setTasks([...tasks, {text: newTask, check: false}]);
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

  //ensure the checbox follows corrct tasks
  //check index
  const checkBox = (index) => {
    const updatedTasks =[...tasks];
    updatedTasks[index].checked = !updatedTasks[index].checked;
    setTasks(updatedTasks);
  };

  //all, WIP, completed 
  //check state 
  const setCheckAction = (checkAction) => {
    setAction(checkAction);
  }

  const stateTasks = tasks.filter(task => {
    if (action === "All") return true;
    if (action === "In Progress")return !task.checked;
    if (action === "Completed") return task.checked;
    return true;
  });


  return (
    <Box textAlign="center" mx="200px" my="100px" px={4}>
      <Flex alignItems="center" justifyContent="space-between" mb={5}>
        <Box flex="1">
          <Text as='b' textAlign="center" fontSize="5xl" fontFamily="Arial, sans-serif">To Do List</Text>
        </Box>
        <Box>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} border="1px solid black">
              Actions
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => setCheckAction("All")}>All</MenuItem>
              <MenuItem onClick={() => setCheckAction("In Progress")}>In Progress</MenuItem>
              <MenuItem onClick={() => setCheckAction("Completed")}>Completed</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
      <HStack mb={4} spacing={2}>
        <Input
          type="text"
          placeholder="Enter your task..."
          value={newTask}
          onChange={handleInputChange}
          autoComplete="off"
        />
        <Button onClick={addTask} colorScheme="teal">Add</Button>
      </HStack>

      <List spacing={3}>
        {stateTasks.map((task, index) => (
          <ListItem 
            key={index} 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between" 
            border="2px solid black" 
            borderRadius="5px" 
            p="10px">

            <Box alignItems="center" justifyContent="space-between" display="flex" m="5px">
              <Checkbox 
                colorScheme="green" 
                size="md" 
                mr={3}
                isChecked={task.checked}
                onChange={() => checkBox(index)}
                />
              <Text as='b' textDecoration={task.checked ? "line-through" : "none"}>{task.text}</Text>
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

