// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Get DOM elements
  const fromDateInput = document.getElementById("fromDate")
  const toDateInput = document.getElementById("toDate")
  const displayFromDate = document.getElementById("displayFromDate")
  const displayToDate = document.getElementById("displayToDate")
  const printBtn = document.getElementById("printBtn")
  const cancelBtn = document.getElementById("cancelBtn")
  const barsContainer = document.getElementById("barsContainer")
  const tooltip = document.getElementById("tooltip")
  const overlay = document.getElementById("overlay")
  const tooltipClose = document.getElementById("tooltipClose")

  // Format date to DD/MM/YYYY
  function formatDate(dateString) {
    if (!dateString) return "[DD/MM/yyyy]"

    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  }

  // Sample data for 31 days
  const chartData = [
    { date: "1", sales: 45, orders: 12, customers: 8 },
    { date: "2", sales: 52, orders: 15, customers: 11 },
    { date: "3", sales: 38, orders: 9, customers: 7 },
    { date: "4", sales: 67, orders: 18, customers: 14 },
    { date: "5", sales: 43, orders: 11, customers: 9 },
    { date: "6", sales: 78, orders: 22, customers: 16 },
    { date: "7", sales: 56, orders: 16, customers: 12 },
    { date: "8", sales: 34, orders: 8, customers: 6 },
    { date: "9", sales: 89, orders: 25, customers: 19 },
    { date: "10", sales: 72, orders: 20, customers: 15 },
    { date: "11", sales: 41, orders: 10, customers: 8 },
    { date: "12", sales: 63, orders: 17, customers: 13 },
    { date: "13", sales: 55, orders: 14, customers: 11 },
    { date: "14", sales: 47, orders: 13, customers: 10 },
    { date: "15", sales: 82, orders: 23, customers: 17 },
    { date: "16", sales: 39, orders: 9, customers: 7 },
    { date: "17", sales: 71, orders: 19, customers: 15 },
    { date: "18", sales: 58, orders: 16, customers: 12 },
    { date: "19", sales: 46, orders: 12, customers: 9 },
    { date: "20", sales: 65, orders: 18, customers: 14 },
    { date: "21", sales: 53, orders: 15, customers: 11 },
    { date: "22", sales: 77, orders: 21, customers: 16 },
    { date: "23", sales: 42, orders: 11, customers: 8 },
    { date: "24", sales: 69, orders: 19, customers: 14 },
    { date: "25", sales: 51, orders: 14, customers: 10 },
    { date: "26", sales: 84, orders: 24, customers: 18 },
    { date: "27", sales: 37, orders: 8, customers: 6 },
    { date: "28", sales: 62, orders: 17, customers: 13 },
    { date: "29", sales: 48, orders: 13, customers: 10 },
    { date: "30", sales: 75, orders: 21, customers: 16 },
    { date: "31", sales: 59, orders: 16, customers: 12 },
  ]

  // Variables
  let activeBar = null
  const maxValue = Math.max(...chartData.map((d) => d.sales))
  const isMobile = window.innerWidth <= 768

  // Update display dates
  function updateDisplayDates() {
    if (displayFromDate) {
      displayFromDate.textContent = formatDate(fromDateInput.value)
    }
    if (displayToDate) {
      displayToDate.textContent = formatDate(toDateInput.value)
    }
  }

  // Handle print functionality
  function handlePrint() {
    console.log("Print button clicked") // Debug log

    // Update dates before printing
    updateDisplayDates()

    // Small delay to ensure DOM updates
    setTimeout(() => {
      window.print()
    }, 100)
  }

  // Handle cancel functionality
  function handleCancel() {
    console.log("Cancel button clicked") // Debug log

    // Clear date inputs
    fromDateInput.value = ""
    toDateInput.value = ""

    // Update display dates
    updateDisplayDates()

    // Show confirmation
    alert("Form cleared successfully!")
  }

  // Initialize chart
  function initChart() {
    createBars()
    setupEventListeners()
  }

  // Create bars with dates directly below them
  function createBars() {
    barsContainer.innerHTML = ""

    chartData.forEach((data, index) => {
      // Create wrapper for bar and date
      const barWrapper = document.createElement("div")
      barWrapper.className = "bar-wrapper"

      // Create bar
      const bar = document.createElement("div")
      bar.className = "bar"
      bar.dataset.index = index

      // Calculate height percentage
      const heightPercent = (data.sales / maxValue) * 100
      bar.style.height = `${heightPercent}%`

      // Create date label
      const dateLabel = document.createElement("div")
      dateLabel.className = "bar-date"
      dateLabel.textContent = data.date

      // Append bar and date to wrapper
      barWrapper.appendChild(bar)
      barWrapper.appendChild(dateLabel)

      // Append wrapper to container
      barsContainer.appendChild(barWrapper)
    })
  }

  // Setup event listeners
  function setupEventListeners() {
    const bars = document.querySelectorAll(".bar")

    bars.forEach((bar) => {
      if (isMobile) {
        // Mobile: click events
        bar.addEventListener("click", handleBarClick)
      } else {
        // Desktop: hover events
        bar.addEventListener("mouseenter", handleBarHover)
        bar.addEventListener("mouseleave", handleBarLeave)
      }
    })

    // Close tooltip events
    if (tooltipClose) {
      tooltipClose.addEventListener("click", hideTooltip)
    }
    if (overlay) {
      overlay.addEventListener("click", hideTooltip)
    }

    // Keyboard accessibility
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        hideTooltip()
      }
    })

    // Window resize
    window.addEventListener("resize", handleResize)
  }

  // Handle bar click (mobile)
  function handleBarClick(e) {
    const index = Number.parseInt(e.target.dataset.index)
    const data = chartData[index]

    // Remove active class from all bars
    document.querySelectorAll(".bar").forEach((b) => b.classList.remove("active"))

    // Add active class to clicked bar
    e.target.classList.add("active")
    activeBar = e.target

    showTooltip(data, e.target)
  }

  // Handle bar hover (desktop)
  function handleBarHover(e) {
    const index = Number.parseInt(e.target.dataset.index)
    const data = chartData[index]

    e.target.classList.add("active")
    activeBar = e.target

    showTooltip(data, e.target)
  }

  // Handle bar leave (desktop)
  function handleBarLeave(e) {
    e.target.classList.remove("active")
    activeBar = null

    hideTooltip()
  }

  // Show tooltip
  function showTooltip(data, barElement) {
    // Update tooltip content
    tooltip.querySelector(".tooltip-date").textContent = `January ${data.date}, 2024`
    tooltip.querySelector(".sales-value").textContent = `₹${data.sales}k`
    tooltip.querySelector(".orders-value").textContent = data.orders
    tooltip.querySelector(".customers-value").textContent = data.customers

    if (isMobile) {
      // Mobile: center tooltip
      tooltip.classList.add("show")
      overlay.classList.add("show")
    } else {
      // Desktop: position near bar
      const rect = barElement.getBoundingClientRect()
      const tooltipRect = tooltip.getBoundingClientRect()

      let left = rect.left + rect.width / 2 - tooltipRect.width / 2
      let top = rect.top - tooltipRect.height - 10

      // Adjust if tooltip goes off screen
      if (left < 10) left = 10
      if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10
      }
      if (top < 10) {
        top = rect.bottom + 10
      }

      tooltip.style.left = `${left}px`
      tooltip.style.top = `${top}px`
      tooltip.classList.add("show")
    }
  }

  // Hide tooltip
  function hideTooltip() {
    tooltip.classList.remove("show")
    overlay.classList.remove("show")

    if (activeBar) {
      activeBar.classList.remove("active")
      activeBar = null
    }
  }

  // Handle window resize
  function handleResize() {
    const newIsMobile = window.innerWidth <= 768

    if (newIsMobile !== isMobile) {
      location.reload() // Reload to reinitialize with correct event listeners
    }

    hideTooltip()
  }

  // Setup event listeners for existing elements
  if (fromDateInput) {
    fromDateInput.addEventListener("change", updateDisplayDates)
  }

  if (toDateInput) {
    toDateInput.addEventListener("change", updateDisplayDates)
  }

  if (printBtn) {
    printBtn.addEventListener("click", handlePrint)
    console.log("Print button event listener added") // Debug log
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", handleCancel)
    console.log("Cancel button event listener added") // Debug log
  }

  // Initialize display dates
  updateDisplayDates()

  // Initialize chart
  initChart()

  // Add some animation on load
  window.addEventListener("load", () => {
    const bars = document.querySelectorAll(".bar")
    bars.forEach((bar, index) => {
      setTimeout(() => {
        bar.style.transform = "scaleY(1)"
        bar.style.transformOrigin = "bottom"
      }, index * 50)
    })
  })

  console.log("JavaScript initialized successfully") // Debug log
})

// Additional print event handlers
window.addEventListener("beforeprint", () => {
  console.log("Before print event triggered")
})

window.addEventListener("afterprint", () => {
  console.log("After print event triggered")
})
