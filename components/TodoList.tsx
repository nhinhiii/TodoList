"use client"
import React, { useEffect, useState } from 'react';
import { Box, Button, Text, Input, List, ListItem, IconButton, HStack, Menu, MenuButton, MenuList, MenuItem, Flex, VStack } from '@chakra-ui/react';
import { DeleteIcon, ChevronDownIcon, EditIcon } from '@chakra-ui/icons';
import { FaArrowCircleUp, FaArrowAltCircleDown } from "react-icons/fa";
import { Checkbox } from '@chakra-ui/react'


type Task = {
    id: string;
    text: string;
    checked: boolean;
}

enum TaskStatus {
    All = "All",
    InProgress = "In Progress",
    Completed = "Completed"
}

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [action, setAction] = useState<TaskStatus>(TaskStatus.All);

  //load
  useEffect(() => {
    if (typeof window !== 'undefined') {
        // cần typeof
      const savedTasks = localStorage.getItem('tasks');
      //error forgot to convert to String 
      //check null/undefined ->throw error
      if (savedTasks) {
        try {
            const parsedTasks: Task[] = JSON.parse(savedTasks);
            if (parsedTasks && Array.isArray(parsedTasks)) {
                setTasks(parsedTasks);
            } else {
                throw new Error("Failed to compile. This is not a valid array");
            }
        } catch (error) {
            //print error
            console.error("Failed to parse tasks from localStorage: ", error);
        }
      } 
    }
  }, []); 

  //save
  useEffect(() => {
    if (tasks.length > 0) {
        const timeOut = setTimeout(() => {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }, 1000);
        return () => clearTimeout(timeOut);
    }
  }, [tasks]);


  const generatedID = () => { 
    return '_' + Math.random().toString(36).slice(2,9);
  }

  const addTask = () => {
    //empty string??
    // if (newTask.trim()) {
    //     const id = generatedID();
    //     setTasks(prevTasks => [...prevTasks, { id, text: newTask, checked: false }]);        setNewTask("");
    //     setNewTask("");
    // }

    //add more effect: check đã tồn tại
    if (newTask.trim()) {
        const id= generatedID();
        const isExist = tasks.some(task => task.text === newTask);

        if (!isExist) {
            setTasks(prevTasks => [...prevTasks, { id, text: newTask, checked: false }]);        setNewTask("");
            setNewTask("");
        } else {
            alert("This task already exists!");
        }
    }
  }

  const deleteTask = (id: string) => {
    setTasks(prevTasks => {
        const updatedTasks = prevTasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Cập nhật localStorage sau khi xóa task
        return updatedTasks;
    });
  }


  const moveTask = (id: string, direction: 'up' | 'down') => {
    const index = tasks.findIndex(task => task.id === id);
    if (index !== -1) {
        const newIndex = direction === 'up' ? index -1 : index + 1;
        if (newIndex >= 0 && newIndex <tasks.length) {
            const newArrTask = [...tasks];
            const [removedTask] = newArrTask.splice(index, 1);
            newArrTask.splice(newIndex, 0, removedTask);
            setTasks(newArrTask);
        } 
    }
  }

  //ensure the checbox follows corrct tasks
  //check index
  const checkBox = (id : string) => {
   setTasks(prevTasks => prevTasks.map(task => task.id === id ? {...task, checked: !task.checked } : task))
  };

  const filteredTasks = tasks.filter(task => {
    switch (action) {
        case "All": return true;
        case "In Progress": return !task.checked;
        case "Completed": return task.checked;
        default:
            return true;
    }
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
              {Object.keys(TaskStatus).map(key => (
                <MenuItem key={key} onClick={() => setAction(TaskStatus[key as keyof typeof TaskStatus])}>
                  {TaskStatus[key as keyof typeof TaskStatus]}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Box>
      </Flex>
      <HStack mb={4} spacing={2}>
        <Input
          type="text"
          placeholder="Enter your task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          autoComplete="off"
        />
        <Button onClick={addTask} colorScheme="teal">Add</Button>
      </HStack>

      <List spacing={3}>
        {filteredTasks.map((task, index) => (
          <ListItem 
            key={task.id} 
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
                onChange={() => checkBox(task.id)}
                />
              <Text as='b' textDecoration={task.checked ? "line-through" : "none"}>{task.text}</Text>
            </Box>
            
            {/* từ chối đặt array, map - vì code chỉ có 3 chức năng -> đơn giản hóa
            sd map vs array nếu nhiều chức năng thực hiện gần tương tự */}
            <HStack spacing={2}>
              <IconButton
                aria-label="Delete task"
                icon={<DeleteIcon />}
                onClick={() => deleteTask(task.id)}
                size="sm"
                colorScheme="red"
              />
              <IconButton
                aria-label="Move up"
                icon={<FaArrowCircleUp />}
                onClick={() => moveTask(task.id, 'up')}
                size="sm"
                colorScheme="yellow"
              />
              <IconButton
                aria-label="Move down"
                icon={<FaArrowAltCircleDown />}
                onClick={() => moveTask(task.id, 'down')}
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