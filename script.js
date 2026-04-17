document.addEventListener("DOMContentLoaded", () => {
    const todoCard = document.querySelector('[data-testid="test-todo-card"]');
    const checkbox = document.querySelector('[data-testid="test-todo-complete-toggle"]');
    const statusBadge = document.querySelector('[data-testid="test-todo-status"]');
    const statusControl = document.querySelector('[data-testid="test-todo-status-control"]');
    const priorityBadge = document.querySelector('[data-testid="test-todo-priority"]');
    const priorityIndicator = document.querySelector('[data-testid="test-todo-priority-indicator"]');
    const timeRemainingEl = document.querySelector('[data-testid="test-todo-time-remaining"]');
    const dueDateEl = document.querySelector('[data-testid="test-todo-due-date"]');
    const overdueIndicator = document.querySelector('[data-testid="test-todo-overdue-indicator"]');
    const expandToggle = document.querySelector('[data-testid="test-todo-expand-toggle"]');
    const collapsibleSection = document.querySelector('[data-testid="test-todo-collapsible-section"]');
    const editBtn = document.querySelector('[data-testid="test-todo-edit-button"]');
    const deleteBtn = document.querySelector('[data-testid="test-todo-delete-button"]');
    const editFormContainer = document.querySelector('[data-testid="test-todo-edit-form"]');
    const editForm = document.getElementById('edit-form');
    const editTitleInput = document.querySelector('[data-testid="test-todo-edit-title-input"]');
    const editDescInput = document.querySelector('[data-testid="test-todo-edit-description-input"]');
    const editPrioritySelect = document.querySelector('[data-testid="test-todo-edit-priority-select"]');
    const editDueDateInput = document.querySelector('[data-testid="test-todo-edit-due-date-input"]');
    const saveBtn = document.querySelector('[data-testid="test-todo-save-button"]');
    const cancelBtn = document.querySelector('[data-testid="test-todo-cancel-button"]');
    const titleEl = document.getElementById("todo-title-text");
    const descEl = document.getElementById("todo-desc-text");
    const expandText = document.querySelector('.expand-text');
    const tagsList = document.querySelector('[data-testid="test-todo-tags"]');

    const state = {
        title: titleEl.textContent,
        description: descEl.textContent,
        priority: 'High',
        status: 'Pending',
        dueDate: new Date('2026-03-01T18:00:00Z'),
        isExpanded: false,
        isEditing: false,
        timeIntervalId: null
    };

    const COLLAPSE_THRESHOLD = 150;

    function init() {
        const offsetMs = (3 * 24 * 60 * 60 * 1000) + (2 * 60 * 60 * 1000);
        state.dueDate = new Date(Date.now() + offsetMs);
        
        updateDueDateDisplay();
        checkExpandNeeded();
        updateTimeRemaining();
        startTimeUpdates();
        syncPriorityIndicator();
    }

    function updateDueDateDisplay() {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        dueDateEl.textContent = `Due ${state.dueDate.toLocaleDateString('en-US', options)}`;
        dueDateEl.setAttribute('datetime', state.dueDate.toISOString());
        
        const isoString = state.dueDate.toISOString().slice(0, 16);
        editDueDateInput.value = state.dueDate.toISOString().slice(0, 16);
    }

    function checkExpandNeeded() {
        const tempDiv = document.createElement('div');
        tempDiv.style.visibility = 'hidden';
        tempDiv.style.position = 'absolute';
        tempDiv.style.width = descEl.offsetWidth + 'px';
        tempDiv.style.font = window.getComputedStyle(descEl).font;
        tempDiv.textContent = descEl.textContent;
        document.body.appendChild(tempDiv);
        const fullHeight = tempDiv.offsetHeight;
        document.body.removeChild(tempDiv);
        
        const lineHeight = parseFloat(window.getComputedStyle(descEl).lineHeight) || 24;
        const thresholdHeight = lineHeight * 3;
        
        if (fullHeight > thresholdHeight) {
            collapsibleSection.style.maxHeight = thresholdHeight + 'px';
            collapsibleSection.classList.remove('expanded');
            expandToggle.hidden = false;
            expandToggle.setAttribute('aria-expanded', 'false');
            state.isExpanded = false;
            expandText.textContent = 'Show more';
        } else {
            expandToggle.hidden = true;
            collapsibleSection.classList.add('expanded');
            collapsibleSection.style.maxHeight = 'none';
        }
    }

    function toggleExpand() {
        state.isExpanded = !state.isExpanded;
        
        if (state.isExpanded) {
            collapsibleSection.classList.add('expanded');
            collapsibleSection.style.maxHeight = collapsibleSection.scrollHeight + 'px';
            expandToggle.setAttribute('aria-expanded', 'true');
            expandText.textContent = 'Show less';
        } else {
            collapsibleSection.classList.remove('expanded');
            const lineHeight = parseFloat(window.getComputedStyle(descEl).lineHeight) || 24;
            const thresholdHeight = lineHeight * 3;
            collapsibleSection.style.maxHeight = thresholdHeight + 'px';
            expandToggle.setAttribute('aria-expanded', 'false');
            expandText.textContent = 'Show more';
        }
    }

    function startTimeUpdates() {
        if (state.timeIntervalId) {
            clearInterval(state.timeIntervalId);
        }
        state.timeIntervalId = setInterval(updateTimeRemaining, 45000);
    }

    function stopTimeUpdates() {
        if (state.timeIntervalId) {
            clearInterval(state.timeIntervalId);
            state.timeIntervalId = null;
        }
    }

    function updateTimeRemaining() {
        if (state.status === 'Done') {
            stopTimeUpdates();
            timeRemainingEl.textContent = 'Completed';
            timeRemainingEl.classList.remove('danger-time');
            overdueIndicator.hidden = true;
            return;
        }

        const now = Date.now();
        const diffMs = state.dueDate.getTime() - now;

        if (diffMs < 0) {
            const absDiff = Math.abs(diffMs);
            const minutesOverdue = Math.floor(absDiff / (1000 * 60));
            const hoursOverdue = Math.floor(absDiff / (1000 * 60 * 60));
            const daysOverdue = Math.floor(absDiff / (1000 * 60 * 60 * 24));

            todoCard.classList.add('overdue');
            overdueIndicator.hidden = false;
            timeRemainingEl.classList.add('danger-time');

            if (daysOverdue > 0) {
                timeRemainingEl.textContent = `Overdue by ${daysOverdue} ${daysOverdue === 1 ? 'day' : 'days'}`;
            } else if (hoursOverdue > 0) {
                timeRemainingEl.textContent = `Overdue by ${hoursOverdue} ${hoursOverdue === 1 ? 'hour' : 'hours'}`;
            } else {
                timeRemainingEl.textContent = `Overdue by ${minutesOverdue} ${minutesOverdue === 1 ? 'minute' : 'minutes'}`;
            }
            return;
        }

        todoCard.classList.remove('overdue');
        overdueIndicator.hidden = true;
        timeRemainingEl.classList.remove('danger-time');

        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 1) {
            timeRemainingEl.textContent = `Due in ${days} days`;
        } else if (days === 1) {
            timeRemainingEl.textContent = "Due tomorrow";
        } else if (hours > 1) {
            timeRemainingEl.textContent = `Due in ${hours} hours`;
        } else if (hours === 1) {
            timeRemainingEl.textContent = `Due in 1 hour`;
        } else if (minutes > 1) {
            timeRemainingEl.textContent = `Due in ${minutes} minutes`;
        } else {
            timeRemainingEl.textContent = "Due now!";
            timeRemainingEl.classList.add('danger-time');
        }
    }

    function syncPriorityIndicator() {
        priorityIndicator.classList.remove('low', 'medium', 'high');
        priorityIndicator.classList.add(state.priority.toLowerCase());
        
        priorityBadge.classList.remove('low', 'medium', 'high');
        priorityBadge.classList.add(state.priority.toLowerCase());
        priorityBadge.textContent = state.priority;
        priorityBadge.setAttribute('aria-label', `Priority: ${state.priority}`);
    }

    function updateStatus(newStatus) {
        state.status = newStatus;
        
        statusBadge.textContent = newStatus;
        statusBadge.classList.remove('pending', 'in-progress', 'done');
        statusControl.value = newStatus;
        
        if (newStatus === 'Pending') {
            statusBadge.classList.add('pending');
            checkbox.checked = false;
            todoCard.classList.remove('completed', 'in-progress');
            todoCard.style.borderLeft = '';
        } else if (newStatus === 'In Progress') {
            statusBadge.classList.add('in-progress');
            checkbox.checked = false;
            todoCard.classList.remove('completed');
            todoCard.classList.add('in-progress');
            todoCard.style.borderLeft = '3px solid var(--gold)';
        } else if (newStatus === 'Done') {
            statusBadge.classList.add('done');
            checkbox.checked = true;
            todoCard.classList.add('completed');
            todoCard.classList.remove('in-progress');
            todoCard.style.borderLeft = '';
            stopTimeUpdates();
        }
        
        statusBadge.setAttribute('aria-label', `Status: ${newStatus}`);
        updateTimeRemaining();
    }

    function enterEditMode() {
        state.isEditing = true;
        state.previousState = {
            title: state.title,
            description: state.description,
            priority: state.priority,
            dueDate: state.dueDate
        };
        
        editTitleInput.value = state.title;
        editDescInput.value = state.description;
        editPrioritySelect.value = state.priority;
        editDueDateInput.value = state.dueDate.toISOString().slice(0, 16);
        
        editFormContainer.hidden = false;
        editBtn.hidden = true;
        deleteBtn.hidden = true;
        expandToggle.hidden = true;
        
        editTitleInput.focus();
    }

    function exitEditMode(save = false) {
        if (save) {
            state.title = editTitleInput.value.trim() || state.title;
            state.description = editDescInput.value.trim();
            state.priority = editPrioritySelect.value;
            
            const newDueDate = new Date(editDueDateInput.value);
            if (!isNaN(newDueDate.getTime())) {
                state.dueDate = newDueDate;
            }
            
            titleEl.textContent = state.title;
            descEl.textContent = state.description;
            syncPriorityIndicator();
            updateDueDateDisplay();
            
            if (state.status !== 'Done') {
                updateTimeRemaining();
                startTimeUpdates();
            }
        } else {
            if (state.previousState) {
                state.title = state.previousState.title;
                state.description = state.previousState.description;
                state.priority = state.previousState.priority;
                state.dueDate = state.previousState.dueDate;
            }
        }
        
        state.isEditing = false;
        state.previousState = null;
        editFormContainer.hidden = true;
        editBtn.hidden = false;
        deleteBtn.hidden = false;
        checkExpandNeeded();
        
        editBtn.focus();
    }

    checkbox.addEventListener("change", (e) => {
        if (state.isEditing) return;
        
        if (e.target.checked) {
            updateStatus('Done');
        } else {
            updateStatus('Pending');
        }
    });

    statusControl.addEventListener("change", (e) => {
        if (state.isEditing) return;
        updateStatus(e.target.value);
    });

    expandToggle.addEventListener("click", toggleExpand);

    expandToggle.addEventListener("keydown", (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleExpand();
        }
    });

    editBtn.addEventListener("click", enterEditMode);

    cancelBtn.addEventListener("click", () => {
        exitEditMode(false);
    });

    editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        exitEditMode(true);
    });

    editForm.addEventListener("keydown", (e) => {
        if (e.key === 'Escape') {
            exitEditMode(false);
        }
    });

    deleteBtn.addEventListener("click", () => {
        const confirmed = confirm("Are you sure you want to delete this task?");
        if (confirmed) {
            stopTimeUpdates();
            todoCard.style.transition = "all 0.3s cubic-bezier(0.25, 1, 0.5, 1)";
            todoCard.style.opacity = "0";
            todoCard.style.transform = "scale(0.9) translateY(10px)";

            setTimeout(() => {
                todoCard.innerHTML = `
                    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding: 3rem 1rem; color: var(--muted); height: 100%;">
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16" style="margin-bottom: 1rem; color: rgba(255,255,255,0.1);">
                            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                        <h3 style="color: var(--light-accent); margin: 0 0 0.5rem 0; font-family: var(--font-heading);">No Task Found</h3>
                        <p style="font-size: 0.95rem; margin: 0;">This task has been cleared.</p>
                    </div>
                `;
                todoCard.style.transform = "translate3d(0, 0, 0) scale(1)";
                todoCard.style.opacity = "1";
            }, 300);
        }
    });

    init();
});
