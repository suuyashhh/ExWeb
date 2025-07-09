// Counter Animation
function animateCounter(element, target, duration = 2000) {
  const start = 0
  const increment = target / (duration / 16)
  let current = start

  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
      element.classList.add("animate")
      setTimeout(() => element.classList.remove("animate"), 500)
    }

    // Format number based on target value
    if (target > 1000) {
      element.textContent = "₹" + Math.floor(current).toLocaleString("en-IN")
    } else {
      element.textContent = Math.floor(current)
    }
  }, 16)
}

// Initialize counters when page loads
document.addEventListener("DOMContentLoaded", () => {
  // Add loading class to all cards
  const cards = document.querySelectorAll(".stat-card, .partner-card")
  cards.forEach((card, index) => {
    card.classList.add("loading")
    card.style.animationDelay = `${index * 100}ms`
  })

  // Start counter animations after a delay
  setTimeout(() => {
    const counters = document.querySelectorAll(".stat-number[data-target]")
    counters.forEach((counter) => {
      const target = Number.parseInt(counter.getAttribute("data-target"))
      animateCounter(counter, target)
    })
  }, 500)
})

// Add hover effects
document.querySelectorAll(".stat-card").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-5px)"
  })

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)"
  })
})

// Add click effects
document.querySelectorAll(".stat-card, .partner-card").forEach((card) => {
  card.addEventListener("click", function () {
    this.style.transform = "scale(0.95)"
    setTimeout(() => {
      this.style.transform = ""
    }, 150)
  })
})

// Refresh data simulation
function refreshStats() {
  const counters = document.querySelectorAll(".stat-number[data-target]")
  counters.forEach((counter) => {
    const currentTarget = Number.parseInt(counter.getAttribute("data-target"))
    const newTarget = Math.floor(currentTarget * (0.8 + Math.random() * 0.4))
    counter.setAttribute("data-target", newTarget)
    animateCounter(counter, newTarget, 1000)
  })
}

// Auto refresh every 30 seconds (optional)
// setInterval(refreshStats, 30000);




// document.addEventListener('DOMContentLoaded', function() {
//   const statsGrids = document.querySelectorAll('.stats-grid');
//   statsGrids.forEach(grid => {
//     if (grid.children.length > 4) {
//       grid.classList.add('has-many-cards');
//     }
//   });
// });