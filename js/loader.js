/**
 * Component Loader
 * Loads HTML components (header, footer, sidebar) into pages
 */

class ComponentLoader {
    constructor() {
        this.componentsPath = '/components/';
        this.components = {
            header: 'header.html',
            footer: 'footer.html',
            sidebar: 'sidebar.html'
        };
    }

    /**
     * Load a single component
     * @param {string} componentName - Name of the component (header, footer, sidebar)
     * @param {string} targetId - ID of the target element where component will be loaded
     */
    async loadComponent(componentName, targetId) {
        const targetElement = document.getElementById(targetId);
        
        if (!targetElement) {
            console.error(`Target element #${targetId} not found`);
            return false;
        }

        // Show skeleton loader
        this.showSkeleton(targetElement, componentName);

        try {
            const response = await fetch(`${this.componentsPath}${this.components[componentName]}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const html = await response.text();
            
            // Insert component HTML
            targetElement.innerHTML = html;
            targetElement.classList.add('component-loaded');
            targetElement.classList.remove('component-loading');
            
            // Trigger custom event for component loaded
            const event = new CustomEvent('componentLoaded', { 
                detail: { componentName, targetId } 
            });
            document.dispatchEvent(event);
            
            return true;
        } catch (error) {
            console.error(`Error loading ${componentName}:`, error);
            this.showError(targetElement, componentName);
            return false;
        }
    }

    /**
     * Show skeleton loader
     */
    showSkeleton(element, componentName) {
        element.classList.add('component-loading');
        element.innerHTML = `<div class="${componentName}-skeleton"></div>`;
    }

    /**
     * Show error message
     */
    showError(element, componentName) {
        element.innerHTML = `
            <div class="component-error">
                <p>⚠️ ${componentName} লোড করতে ব্যর্থ হয়েছে</p>
                <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; cursor: pointer;">
                    পুনরায় চেষ্টা করুন
                </button>
            </div>
        `;
    }

    /**
     * Load all components
     */
    async loadAll() {
        const loads = [
            this.loadComponent('header', 'header-placeholder'),
            this.loadComponent('sidebar', 'sidebar-placeholder'),
            this.loadComponent('footer', 'footer-placeholder')
        ];

        const results = await Promise.all(loads);
        
        if (results.every(result => result === true)) {
            console.log('✅ All components loaded successfully');
            
            // Dispatch event when all components are loaded
            const event = new CustomEvent('allComponentsLoaded');
            document.dispatchEvent(event);
        } else {
            console.warn('⚠️ Some components failed to load');
        }
    }
}

// Initialize loader when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComponentLoader);
} else {
    initComponentLoader();
}

function initComponentLoader() {
    const loader = new ComponentLoader();
    loader.loadAll();
}

// Export for use in other scripts
window.ComponentLoader = ComponentLoader;