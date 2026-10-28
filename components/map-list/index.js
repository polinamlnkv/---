// Компонент по заданию варианта: список карт участника
// в порядке его приоритета. Реализован на основе Bootstrap-компонента
// "Список" (list-group) + бейджи (badge) для номера приоритета.
export class MapListComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getItemHTML(map, index) {
        return (
            `
                <li class="list-group-item">
                    <span class="priority-badge">${index + 1}</span>
                    <span class="map-name">${map.name}</span>
                    <span class="map-tag">${map.tag}</span>
                </li>
            `
        )
    }

    getHTML(maps) {
        // maps уже должны приходить отсортированными по приоритету участника
        const itemsHTML = maps
            .map((map, index) => this.getItemHTML(map, index))
            .join('')

        return (
            `
                <p class="drag-hint">⠿ Перетащите карты мышкой, чтобы изменить приоритет</p>
                <ul class="list-group map-list">
                    ${itemsHTML}
                </ul>
            `
        )
    }

    // "Прикольная" фича №1: перетаскивание элементов списка мышью
    // (нативный HTML5 Drag & Drop), после чего номера приоритета
    // в бейджах пересчитываются по новому порядку в DOM.
    enableDragAndDrop() {
        const listEl = this.parent.querySelector('.map-list')
        if (!listEl) return

        let draggedItem = null

        listEl.querySelectorAll('.list-group-item').forEach((item) => {
            item.setAttribute('draggable', 'true')

            item.addEventListener('dragstart', () => {
                draggedItem = item
                item.classList.add('dragging')
            })

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging')
                this.updatePriorityBadges(listEl)
            })

            item.addEventListener('dragover', (event) => {
                event.preventDefault()
                const afterElement = this.getItemAfterPointer(listEl, event.clientY)
                if (afterElement == null) {
                    listEl.appendChild(draggedItem)
                } else {
                    listEl.insertBefore(draggedItem, afterElement)
                }
            })
        })
    }

    // определяет, перед каким элементом сейчас находится курсор при перетаскивании
    getItemAfterPointer(listEl, pointerY) {
        const items = [...listEl.querySelectorAll('.list-group-item:not(.dragging)')]

        return items.reduce((closest, child) => {
            const box = child.getBoundingClientRect()
            const offset = pointerY - box.top - box.height / 2
            if (offset < 0 && offset > closest.offset) {
                return { offset, element: child }
            }
            return closest
        }, { offset: Number.NEGATIVE_INFINITY, element: null }).element
    }

    // пересчитывает номера приоритета (1, 2, 3...) по текущему порядку в DOM
    updatePriorityBadges(listEl) {
        listEl.querySelectorAll('.list-group-item').forEach((item, index) => {
            item.querySelector('.priority-badge').textContent = index + 1
        })
    }

    render(maps) {
        const html = this.getHTML(maps)
        this.parent.insertAdjacentHTML('beforeend', html)
        this.enableDragAndDrop()
    }
}
