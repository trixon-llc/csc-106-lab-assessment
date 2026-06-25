/* ============================
   script.js - Main JavaScript
   Student Portfolio & Academic Management
   ============================ */

// ============================
// Navigation - Mobile Hamburger Menu
// ============================
document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      // Animate hamburger lines
      const spans = hamburger.querySelectorAll('span');
      hamburger.classList.toggle('active');
      if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu when clicking a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // ============================
  // Scroll Animations (Fade-in)
  // ============================
  const fadeElements = document.querySelectorAll('.fade-in');

  function checkFadeIn() {
    fadeElements.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', checkFadeIn);
  checkFadeIn(); // Run on load

  // ============================
  // Skill Bar Animations
  // ============================
  var skillBars = document.querySelectorAll('.skill-bar');

  function animateSkillBars() {
    skillBars.forEach(function (bar) {
      var rect = bar.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) {
        var width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
      }
    });
  }

  window.addEventListener('scroll', animateSkillBars);
  animateSkillBars(); // Run on load

  // ============================
  // Navbar Shadow on Scroll
  // ============================
  var navbar = document.getElementById('navbar');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 10px 30px -10px rgba(2,12,27,0.7)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });

  // ============================
  // Academic Planner - Task Management
  // ============================
  var addTaskBtn = document.getElementById('addTaskBtn');
  var taskInput = document.getElementById('taskInput');
  var taskPriority = document.getElementById('taskPriority');
  var taskList = document.getElementById('taskList');
  var emptyState = document.getElementById('emptyState');

  // Array to store tasks
  var tasks = [];

  // Load tasks from localStorage
  function loadTasks() {
    var savedTasks = localStorage.getItem('academicTasks');
    if (savedTasks) {
      tasks = JSON.parse(savedTasks);
    }
  }

  // Save tasks to localStorage
  function saveTasks() {
    localStorage.setItem('academicTasks', JSON.stringify(tasks));
  }

  // Update task statistics
  function updateStats() {
    var totalEl = document.getElementById('totalTasks');
    var completedEl = document.getElementById('completedTasks');
    var pendingEl = document.getElementById('pendingTasks');

    if (totalEl && completedEl && pendingEl) {
      var total = tasks.length;
      var completed = 0;
      for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].completed) {
          completed++;
        }
      }
      var pending = total - completed;

      totalEl.textContent = total;
      completedEl.textContent = completed;
      pendingEl.textContent = pending;
    }
  }

  // Render tasks to the DOM
  function renderTasks(filter) {
    if (!taskList) return;

    // Clear current task items (keep empty state)
    var currentItems = taskList.querySelectorAll('.task-item');
    for (var i = 0; i < currentItems.length; i++) {
      currentItems[i].remove();
    }

    // Determine which tasks to show
    var filteredTasks = [];
    for (var j = 0; j < tasks.length; j++) {
      var task = tasks[j];
      if (!filter || filter === 'all') {
        filteredTasks.push(task);
      } else if (filter === 'completed' && task.completed) {
        filteredTasks.push(task);
      } else if (filter === 'pending' && !task.completed) {
        filteredTasks.push(task);
      } else if (filter === 'high' && task.priority === 'high') {
        filteredTasks.push(task);
      }
    }

    // Show or hide empty state
    if (emptyState) {
      emptyState.style.display = filteredTasks.length === 0 ? 'block' : 'none';
    }

    // Create task elements
    for (var k = 0; k < filteredTasks.length; k++) {
      var t = filteredTasks[k];
      var taskEl = createTaskElement(t);
      taskList.appendChild(taskEl);
    }

    updateStats();
  }

  // Create a single task element
  function createTaskElement(task) {
    var div = document.createElement('div');
    div.className = 'task-item' + (task.completed ? ' completed' : '');
    div.setAttribute('data-id', task.id);

    // Checkbox
    var checkbox = document.createElement('div');
    checkbox.className = 'task-checkbox';
    checkbox.addEventListener('click', function () {
      toggleTask(task.id);
    });

    // Task text
    var textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text;

    // Priority badge
    var prioritySpan = document.createElement('span');
    prioritySpan.className = 'task-priority priority-' + task.priority;
    prioritySpan.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

    // Delete button
    var deleteBtn = document.createElement('button');
    deleteBtn.className = 'task-delete';
    deleteBtn.textContent = '\u2715';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.addEventListener('click', function () {
      deleteTask(task.id);
    });

    div.appendChild(checkbox);
    div.appendChild(textSpan);
    div.appendChild(prioritySpan);
    div.appendChild(deleteBtn);

    return div;
  }

  // Add a new task
  function addTask() {
    if (!taskInput) return;

    var text = taskInput.value.trim();
    if (text === '') {
      taskInput.style.borderColor = '#ef476f';
      taskInput.focus();
      setTimeout(function () {
        taskInput.style.borderColor = '';
      }, 1500);
      return;
    }

    var newTask = {
      id: Date.now(),
      text: text,
      priority: taskPriority ? taskPriority.value : 'medium',
      completed: false
    };

    tasks.push(newTask);
    saveTasks();
    taskInput.value = '';
    renderTasks(getCurrentFilter());
  }

  // Toggle task completion
  function toggleTask(id) {
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id === id) {
        tasks[i].completed = !tasks[i].completed;
        break;
      }
    }
    saveTasks();
    renderTasks(getCurrentFilter());
  }

  // Delete a task
  function deleteTask(id) {
    var newTasks = [];
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id !== id) {
        newTasks.push(tasks[i]);
      }
    }
    tasks = newTasks;
    saveTasks();
    renderTasks(getCurrentFilter());
  }

  // Get current active filter
  function getCurrentFilter() {
    var activeBtn = document.querySelector('.filter-btn.active');
    return activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
  }

  // Event listeners for planner
  if (addTaskBtn) {
    addTaskBtn.addEventListener('click', addTask);
  }

  if (taskInput) {
    taskInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        addTask();
      }
    });
  }

  // Filter buttons
  var filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Remove active from all
      filterBtns.forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      renderTasks(btn.getAttribute('data-filter'));
    });
  });

  // Initialize planner
  if (taskList) {
    loadTasks();
    renderTasks('all');
  }

  // ============================
  // Contact Form Validation
  // ============================
  var contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var isValid = validateForm();
      if (isValid) {
        // Show success message
        var successMsg = document.getElementById('formSuccess');
        if (successMsg) {
          successMsg.style.display = 'block';
        }
        contactForm.reset();
        // Hide success after 5 seconds
        setTimeout(function () {
          if (successMsg) {
            successMsg.style.display = 'none';
          }
        }, 5000);
      }
    });
  }

  // Form validation function
  function validateForm() {
    var valid = true;

    // Name validation
    var nameInput = document.getElementById('contactName');
    var nameGroup = document.getElementById('nameGroup');
    if (nameInput && nameGroup) {
      if (nameInput.value.trim() === '') {
        nameGroup.classList.add('error');
        valid = false;
      } else {
        nameGroup.classList.remove('error');
      }
    }

    // Email validation
    var emailInput = document.getElementById('contactEmail');
    var emailGroup = document.getElementById('emailGroup');
    if (emailInput && emailGroup) {
      var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(emailInput.value.trim())) {
        emailGroup.classList.add('error');
        valid = false;
      } else {
        emailGroup.classList.remove('error');
      }
    }

    // Phone validation - must contain only digits (optional leading + allowed)
    var phoneInput = document.getElementById('contactPhone');
    var phoneGroup = document.getElementById('phoneGroup');
    if (phoneInput && phoneGroup) {
      var phoneValue = phoneInput.value.trim();
      var digitsOnly = /^\+?\d+$/;
      if (phoneValue === '' || !digitsOnly.test(phoneValue)) {
        phoneGroup.classList.add('error');
        valid = false;
      } else {
        phoneGroup.classList.remove('error');
      }
    }

    // Message validation
    var messageInput = document.getElementById('contactMessage');
    var messageGroup = document.getElementById('messageGroup');
    if (messageInput && messageGroup) {
      if (messageInput.value.trim() === '') {
        messageGroup.classList.add('error');
        valid = false;
      } else {
        messageGroup.classList.remove('error');
      }
    }

    return valid;
  }

  // Clear error on input
  var formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
  formInputs.forEach(function (input) {
    input.addEventListener('input', function () {
      var group = input.closest('.form-group');
      if (group) {
        group.classList.remove('error');
      }
    });
  });

}); // end DOMContentLoaded
