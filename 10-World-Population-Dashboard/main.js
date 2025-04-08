import * as THREE from 'three';
import * as d3 from 'd3';
import { Chart } from 'chart.js/auto';
import { gsap } from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Initialize Globe
const initGlobe = () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('globe-canvas'),
    antialias: true,
    alpha: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.z = 5;

  // Add OrbitControls for interaction
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.5;
  controls.enableZoom = true;
  controls.minDistance = 3;
  controls.maxDistance = 10;

  // Create globe geometry with higher detail
  const geometry = new THREE.SphereGeometry(2, 128, 128);
  
  // Create earth material with multiple textures
  const textureLoader = new THREE.TextureLoader();
  
  const earthTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');
  const bumpMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg');
  const specularMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg');
  
  const material = new THREE.MeshPhongMaterial({
    map: earthTexture,
    bumpMap: bumpMap,
    bumpScale: 0.05,
    specularMap: specularMap,
    specular: new THREE.Color('grey'),
    shininess: 10
  });

  const globe = new THREE.Mesh(geometry, material);
  scene.add(globe);

  // Add atmosphere glow
  const atmosphereGeometry = new THREE.SphereGeometry(2.1, 128, 128);
  const atmosphereMaterial = new THREE.MeshPhongMaterial({
    color: 0x4ade80,
    transparent: true,
    opacity: 0.1,
    side: THREE.BackSide
  });
  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  scene.add(atmosphere);

  // Enhanced lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(5, 3, 5);
  scene.add(pointLight);

  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };

  animate();

  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
};

// Initialize Charts
const initCharts = () => {
  // Sample data with more realistic values
  const populationData = {
    countries: ['China', 'India', 'USA', 'Indonesia', 'Pakistan', 'Brazil', 'Nigeria', 'Bangladesh', 'Russia', 'Mexico'],
    population: [1439, 1380, 331, 274, 221, 213, 206, 165, 146, 129],
    growthRate: [0.39, 0.99, 0.59, 1.07, 2.00, 0.72, 2.58, 1.01, 0.04, 1.06],
    years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
    totalPopulation: [6916, 7000, 7084, 7176, 7272, 7358, 7444, 7530, 7618, 7713, 7794],
    gdp: [14722, 2622, 20937, 1058, 263, 1445, 432, 324, 1483, 1076],
    ageGroups: {
      male: [5.2, 4.8, 4.5, 4.2, 3.9, 3.6, 3.3, 2.8, 2.3, 1.8, 1.2, 0.7],
      female: [5.0, 4.6, 4.3, 4.0, 3.7, 3.4, 3.1, 2.6, 2.1, 1.6, 1.0, 0.5]
    }
  };

  // Bar Chart
  const barChart = new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: {
      labels: populationData.countries,
      datasets: [{
        label: 'Population (millions)',
        data: populationData.population,
        backgroundColor: '#4ade80',
        borderColor: '#22c55e',
        borderWidth: 1,
        borderRadius: 5,
        hoverBackgroundColor: '#86efac'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });

  // Pie Chart
  const pieChart = new Chart(document.getElementById('pieChart'), {
    type: 'doughnut',
    data: {
      labels: ['Asia', 'Africa', 'Europe', 'Americas', 'Oceania'],
      datasets: [{
        data: [60, 17, 10, 12, 1],
        backgroundColor: [
          '#4ade80',
          '#3b82f6',
          '#ef4444',
          '#f59e0b',
          '#8b5cf6'
        ],
        borderColor: '#1a1a2e',
        borderWidth: 2,
        hoverOffset: 10
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.label}: ${context.raw}%`
          }
        }
      },
      cutout: '60%'
    }
  });

  // Initialize D3.js charts
  initD3Charts(populationData);
};

const initD3Charts = (data) => {
  // Line Chart
  const margin = { top: 20, right: 30, bottom: 30, left: 60 };
  const width = 500 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  // Line Chart
  const lineChart = d3.select('#lineChart')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear()
    .domain(d3.extent(data.years))
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([6000, d3.max(data.totalPopulation)])
    .range([height, 0]);

  lineChart.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.format('d')))
    .style('color', 'white');

  lineChart.append('g')
    .call(d3.axisLeft(y))
    .style('color', 'white');

  lineChart.append('path')
    .datum(data.years.map((year, i) => ({ year, population: data.totalPopulation[i] })))
    .attr('fill', 'none')
    .attr('stroke', '#4ade80')
    .attr('stroke-width', 2)
    .attr('d', d3.line()
      .x(d => x(d.year))
      .y(d => y(d.population))
    );

  // Scatter Plot (GDP vs Population)
  const scatterPlot = d3.select('#scatterPlot')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const xGDP = d3.scaleLinear()
    .domain([0, d3.max(data.gdp)])
    .range([0, width]);

  const yPop = d3.scaleLinear()
    .domain([0, d3.max(data.population)])
    .range([height, 0]);

  scatterPlot.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xGDP))
    .style('color', 'white');

  scatterPlot.append('g')
    .call(d3.axisLeft(yPop))
    .style('color', 'white');

  scatterPlot.selectAll('circle')
    .data(data.countries.map((country, i) => ({
      country,
      gdp: data.gdp[i],
      population: data.population[i]
    })))
    .enter()
    .append('circle')
    .attr('cx', d => xGDP(d.gdp))
    .attr('cy', d => yPop(d.population))
    .attr('r', 6)
    .attr('fill', '#4ade80')
    .append('title')
    .text(d => `${d.country}: GDP $${d.gdp}B, Pop ${d.population}M`);

  // Population Pyramid
  const pyramidWidth = width;
  const pyramidHeight = height;
  const pyramidMargin = { ...margin };

  const pyramid = d3.select('#populationPyramid')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${pyramidWidth + pyramidMargin.left + pyramidMargin.right} ${pyramidHeight + pyramidMargin.top + pyramidMargin.bottom}`)
    .append('g')
    .attr('transform', `translate(${pyramidWidth / 2 + pyramidMargin.left},${pyramidMargin.top})`);

  const ageGroups = ['0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55+'];
  const yScale = d3.scaleBand()
    .domain(ageGroups)
    .range([0, pyramidHeight])
    .padding(0.1);

  const xScale = d3.scaleLinear()
    .domain([0, 6])
    .range([0, pyramidWidth / 2]);

  // Male bars
  pyramid.selectAll('.male')
    .data(data.ageGroups.male)
    .enter()
    .append('rect')
    .attr('class', 'male')
    .attr('x', d => -xScale(d))
    .attr('y', (d, i) => yScale(ageGroups[i]))
    .attr('width', d => xScale(d))
    .attr('height', yScale.bandwidth())
    .attr('fill', '#3b82f6');

  // Female bars
  pyramid.selectAll('.female')
    .data(data.ageGroups.female)
    .enter()
    .append('rect')
    .attr('class', 'female')
    .attr('x', 0)
    .attr('y', (d, i) => yScale(ageGroups[i]))
    .attr('width', d => xScale(d))
    .attr('height', yScale.bandwidth())
    .attr('fill', '#ec4899');

  // Add labels
  pyramid.selectAll('.age-label')
    .data(ageGroups)
    .enter()
    .append('text')
    .attr('class', 'age-label')
    .attr('x', 0)
    .attr('y', d => yScale(d) + yScale.bandwidth() / 2)
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
    .attr('dy', '0.35em')
    .text(d => d);

  // Regional Population (Bubble Chart)
  const bubbleChart = d3.select('#bubbleChart')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const regions = [
    { name: 'East Asia', population: 1650, growth: 0.3 },
    { name: 'South Asia', population: 1900, growth: 1.1 },
    { name: 'Europe', population: 750, growth: 0.1 },
    { name: 'North America', population: 370, growth: 0.6 },
    { name: 'Africa', population: 1340, growth: 2.5 },
    { name: 'Latin America', population: 650, growth: 0.9 },
    { name: 'Oceania', population: 43, growth: 1.3 }
  ];

  const bubbleScale = d3.scaleSqrt()
    .domain([0, d3.max(regions, d => d.population)])
    .range([5, 50]);

  const simulation = d3.forceSimulation(regions)
    .force('x', d3.forceX(width / 2))
    .force('y', d3.forceY(height / 2))
    .force('collide', d3.forceCollide(d => bubbleScale(d.population) + 2));

  const bubbles = bubbleChart.selectAll('.bubble')
    .data(regions)
    .enter()
    .append('circle')
    .attr('class', 'bubble')
    .attr('r', d => bubbleScale(d.population))
    .attr('fill', (d, i) => d3.interpolateViridis(i / 6))
    .attr('stroke', 'white')
    .attr('stroke-width', 1);

  simulation.on('tick', () => {
    bubbles
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
  });

  bubbles.append('title')
    .text(d => `${d.name}\nPopulation: ${d.population}M\nGrowth: ${d.growth}%`);
};

// Initialize search functionality
const initSearch = () => {
  const searchInput = document.getElementById('search');
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    // Implement search logic here
  });
};

// Initialize navigation
const initNavigation = () => {
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = e.target.getAttribute('href').substring(1);
      document.getElementById(targetId).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initGlobe();
  initCharts();
  initSearch();
  initNavigation();

  // Add smooth scroll behavior
  gsap.to('.chart-container', {
    opacity: 1,
    y: 0,
    stagger: 0.2,
    scrollTrigger: {
      trigger: '.chart-container',
      start: 'top center',
      toggleActions: 'play none none reverse'
    }
  });
});